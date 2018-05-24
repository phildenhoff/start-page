<template>
  <div id='app' v-on:keyup.esc='hide_help'>
    <span id='clock'> {{hours}}:{{minutes}}</span>
    <input id='search-box' v-model='cmd' v-on:keyup.enter='parseCmd' v-on:keyup.up='show_prev_cmd' v-on:keyup.down='show_next_cmd' autofocus autocomplete='off' autocapitalize='none' size='30' placeholder='help'>

    <transition name='fade'>
      <div id='overlay' v-if='display_help === true' v-on:click='hide_help'>
        <h1 class='title'>Help</h1>
          <h3 class='subtitle'>Press <span class='key'>esc</span> to close.</h3>
          <section id='commandListingContainer'>
              <section class='commandList' v-for='category in command_categories' :key='category.title'>
                <h3>{{category.title}}</h3>
                <ul id='searchList'>
                   <li v-for='cmd in category.list' :key='cmd.command'>
                      {{ cmd.helpDesc }}  <br />
                      <span class='command'>{{ cmd.helpCommand }}</span>
                    </li>
                </ul>
              </section>
          </section>
      </div>
    </transition>

    <notifications group='notify' />
  </div>
</template>

<script>
import * as search from './commands/search.js'
import * as browser from './commands/browser.js'
import * as remote from './commands/remote.js'

const DEFAULT_COMMAND = 'g'

function padZero (num) {
    if (num < 10) {
        return '0' + num
    } else return num
}

function getDate () {
    return new Date()
}

function getMinutes () {
    return padZero(getDate().getMinutes())
}

function getHour () {
    return padZero(getDate().getHours() % 12)
}

function autoPopulate (cmdList, commandFile, type, vm) {
    for (let val of Object.getOwnPropertyNames(commandFile)) {
        // Ignore __esModule and set defaultFunction to execute for this file type
        if (val === '__esModule') continue
        if (val === 'defaultFunction') {
            vm.categoryFunctions[type] = commandFile[val]
            continue
        }
        if (val.includes('hidden')) {
            continue
        }
        cmdList[val] = commandFile[val]
        if (!cmdList[val]['helpCommand']) {
            cmdList[val]['helpCommand'] = val + ';[query]'
        }
        if (typeof cmdList[val]['helpDesc'] === 'undefined') {
            cmdList[val]['helpDesc'] = cmdList[val]['title']
        }
    }
    // Title is upper-cased version of type
    const title = type.charAt(0).toUpperCase() + type.slice(1)
    vm.command_categories.push({title, list: cmdList})
}

export default {
    name: 'app',
    data () {
        return {
            cmd: '', // Most recent command
            cmd_history: [], // History of all commands, first being most recent
            cmd_index: 0, // Location in history of commands
            display_help: false, // If try, shows help menu
            minutes: '00',
            hours: '00',
            search_cmds: {}, // All available keyboard shortcuts for search category, determined by file.
            browser_cmds: {}, // All available browser shortcuts
            remote_cmds: {}, // All available remote shortcuts
            command_categories: [], // Different categories of commands
            category_functions: {} // Functions for each category
        }
    },
    methods: {
        /** Processes user commands.
         * Clears command line, opens help menu,
         * warns of errors for missing default command, and otherwise executes commands.
         * @author Phil Denhoff <phildenhoff@gmail.com>
         */
        parseCmd: function () {
        // Save command to history and clear current input (looks faster)
            const userInput = this.cmd
            let userCommand
            let tokens
            this.cmd_history.unshift(userInput)
            this.cmd = ''
            this.cmd_index = 0

            /* Display help menu if there's empty input. Otherwise, if there is no command,
            ** use default command (also display an error if that isn't set).
            ** Otherwise, get the user command and tokens from input.
            */
            if (userInput === '' || userInput.toLowerCase() === 'help') {
                this.show_help()
                return
            } else if (!userInput.includes(';')) {
                if (typeof DEFAULT_COMMAND !== 'undefined') {
                    userCommand = DEFAULT_COMMAND
                    tokens = userInput
                } else {
                    this.$notify({
                        group: 'notify',
                        title: 'No command to run',
                        type: 'warning',
                        text: 'Default command has not been set.'
                    })
                    return
                }
            } else {
                [userCommand, tokens] = userInput.split(';')
            }

            // Execute command
            this.execute(userCommand, tokens)
        },

        /** Replaces displayed command with previous command from history. */
        show_prev_cmd: function () {
            this.cmd = this.cmd_history[this.cmd_index]
            if (this.cmd_index < this.cmd_history.length - 1) this.cmd_index++
            console.log(this.cmd)
        },

        /** Replaces displayed command with next command from history. */
        show_next_cmd: function () {
            if (this.cmd_index > 0) {
                this.cmd_index--
                this.cmd = this.cmd_history[this.cmd_index]
            } else {
                this.cmd = ''
                this.cmd_index = 0
            }
        },

        /** Displays help menu. */
        show_help: function () {
            console.log('Showing help')
            this.display_help = true
        },

        /** Hides help menu. */
        hide_help: function () {
            this.display_help = false
        },

        /** Executes command given by user, using given tokens. Looks for function in categories before executing.
         * @param {string} userCommand The command the user wishes to invoke.
         * @param {string[]} tokens Any arguments the user wishes to apply to the command.
         */
        execute: function (userCommand, tokens) {
            const [requestedFunction, commandInfo] = this.find_function(userCommand)
            if (typeof requestedFunction !== 'undefined') {
                requestedFunction(commandInfo, userCommand, tokens, this)
            } else {
                this.$notify({
                    group: 'notify',
                    title: 'Missing function',
                    type: 'warning',
                    text: 'Command not defined in any category.'
                })
            }
        },

        /** Returns the default function for a command, as well as the command info.
         * @param {string} userCommand The command the user wishes to invoke.
         */
        find_function: function (userCommand) {
            for (let cat of this.command_categories) {
                if (cat.list[userCommand]) {
                    return [this.category_functions[cat.list[userCommand].type], cat.list[userCommand]]
                }
            }
            // no function found
            return [undefined, undefined]
        }
    },
    /** Sets timer for clock, loads history from local storage, and populates commands based on files.
     */
    created: function () {
        // Set timer for clock
        var vm = this
        setInterval(() => {
            vm.minutes = getMinutes()
            vm.hours = getHour()
        }, 1000)

        // Load history from LocalStorage
        if (localStorage.getItem('history')) {
            this.cmd_history = JSON.parse(localStorage.getItem('history'))
        }

        // Auto populate based on search file
        autoPopulate(this.search_cmds, search, 'search', vm)
        autoPopulate(this.browser_cmds, browser, 'browser', vm)
        autoPopulate(this.remote_cmds, remote, 'remote', vm)
    },
    watch: {
        cmd_history: function () {
        // Update localstorage when a new item is added to command history.
            localStorage.setItem('history', JSON.stringify(this.cmd_history))
        }
    }
}
</script>

<style lang='scss'>

  :root {
    --bg-color: #2F4858;
    --text-color: #F26419;
    --alt-text-color: #332f2f;
    --accent-color: #F26419;
  }

  body {
    margin: 0;
    background-color: var(--bg-color);
  }

  #app {
    font-family: 'Consolas', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    font-size: 16px;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;

  }

  #clock {
    /* Text */
    font-family: monospace;
    font-size: 6em;
    text-align: center;
    margin-top: 20vh;
    color: var(--text-color);
  }

  #search-box {
    /* Text */
    font-family: Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif;
    font-size: 1.625em;
    resize: none;
    text-align: center;
    /* Display */
    width: 40vw;
    height: 8vh;
    padding: 0px 2vw;
    margin-bottom: 8vh;
    /* Coloring / Styling */
    color: var(--accent-color);
    border-width: 0px;
    border-bottom: 2px solid var(--text-color);
    background-color: var(--bg-color);
    outline: none;
  }

  #overlay {
    width: 100vw;
    min-height: 100%;
    margin: 0;
    background-color: #ff945c;
    position: absolute;
    top: 0vh;
    font-family: sans-serif;
  }

  #overlay .title {
    text-align: center;
    font-family: Roboto, sans-serif;
    font-size: 2em;
    font-weight: 200;
    margin-bottom: 3vh;
    padding: 2vh 8px 2vh 8px;
    color: #fff;
    background-color: var(--alt-text-color);
  }

  #overlay .subtitle {
    text-align: center;
    font-family: sans-serif;
    font-size: 1em;
    font-weight: 200;
    margin-top: 0;
    margin-bottom: 3vh;
    color: var(--alt-text-color);
  }

  #overlay .key {
    color: #ff945c;
    background: var(--alt-text-color);
    padding: 2px 4px 3px 4px;
    border-radius: 5px;
  }

  section#commandListingContainer {
    width: 90%;
    padding-right: 5%;
    padding-left: 5%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  section .commandList {
    width: 30%;
    color: var(--alt-text-color);
  }

  section .commandList li {
    margin-bottom: 16px;
    list-style: none;
  }

  section .commandList h3 {
    text-align: center;
    font-family: sans-serif;
  }

  section .commandList .command {
    font-family: monospace;
    font-size: 0.8em;
    color:  var(--bg-color);
  }

  h1.title {
    margin-top: 0;
  }

  .warning {
    margin-top: 2vh;
    margin-left: 2vh;
    min-width: 15vw;
    background-color: #e74c3c;
    border-left-color:#b82e24;
    font-size: 1.1em;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
