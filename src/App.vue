<template>
  <div id='app' @keydown.esc='hide_help'>
    <span class='clock'> {{hours}}:{{minutes}}</span>
    <input id='search-box' v-model='cmd' v-on:keyup.enter='parseCmd' v-on:keyup.up='show_prev_cmd' v-on:keyup.down='show_next_cmd' autofocus autocomplete='off' autocapitalize='none' size='30' placeholder='get started...'>
    <button class='btn__flat __align-right' v-on:click='show_help'>Help</button>

    <aside class="credit">
        <p class="logo-lead-in">Made by</p>
        <button class='btn__flat __align-left'><a class="nostyle phil-denhoff-logo" href="https://denhoff.ca">Phil<br>Denhoff</a></button>
    </aside>

    <transition name='fade'>
      <div id='overlay' v-if='display_help === true'>
          <header class='title'>
            <button class='exit' v-on:click='hide_help'></button>
            <h1>Help</h1>
          </header>
          <h3 class='subtitle' v-html="device_dependent_text[device_style]['overlay_subtitle']">Press X to close.</h3>
          <section id='commandListingContainer'>
              <section class='commandList' v-for='category in command_categories' :key='category.title'>
                <h3>{{category.title}}</h3>
                <dl id='searchList'>
                   <template v-for='cmd in category.list' >
                      <dt :key="cmd.command+'_dt'">{{ cmd.helpDesc }}</dt>
                      <dd class='command' :key="cmd.command+'_dd'">{{ cmd.helpCommand }}</dd>
                    </template>
                </dl>
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
    let hour = getDate().getHours() % 12
    if (hour === 0) hour = 12
    return padZero(hour)
}

function autoPopulate (cmdList, commandFile, type, vm) {
    for (let val of Object.getOwnPropertyNames(commandFile)) {
        // Ignore __esModule and set defaultFunction to execute for this file type
        if (val === '__esModule') continue
        if (val === 'defaultFunction') {
            vm.category_functions[type] = commandFile[val]
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
            category_functions: {}, // Functions for each category
            clock_unready: true,
            device_style: '', // Set to a value on component `created`
            device_dependent_text: {
                'mobile': {
                    'overlay_subtitle': 'Press X to close'
                },
                'desktop': {
                    'overlay_subtitle': 'Press <span class="key">esc</span> to close.'
                }
            }
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
            console.log('Hiding help')
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
        },

        escapeKeyListener: function (evt) {
            if (evt.keyCode === 27 && this.display_help) {
                this.hide_help()
            }
        },

        detectMobile: function () {
            if (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)) {
                return true
            } else {
                return false
            }
        }
    },
    destroyed: function () {
        document.removeEventListener('keyup', this.escapeKeyListener)
    },
    /** Sets timer for clock, loads history from local storage, and populates commands based on files.
     */
    created: function () {
        // Add escape key event listener
        document.addEventListener('keyup', this.escapeKeyListener)

        this.minutes = getMinutes()
        this.hours = getHour()

        // Set timer for clock
        setInterval(() => {
            this.minutes = getMinutes()
            this.hours = getHour()
        }, 1000)

        // Load history from LocalStorage
        if (localStorage.getItem('history')) {
            this.cmd_history = JSON.parse(localStorage.getItem('history'))
        }

        // Set the device-dependent text
        if (this.detectMobile()) {
            this.device_style = 'mobile'
        } else {
            this.device_style = 'desktop'
        }

        // Auto populate based on search file
        autoPopulate(this.search_cmds, search, 'search', this)
        autoPopulate(this.browser_cmds, browser, 'browser', this)
        autoPopulate(this.remote_cmds, remote, 'remote', this)
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
    --bg-color: #f8f8f8;
    --bg-color__light: #9e9e9e33;
    --clock-color: #F26419;
    --text-color: #332f2f;
    --alt-text-color: #2066b2;
    --accent-color: #F26419;
  }

  body {
    margin: 0;
    background-color: var(--bg-color);
  }

  a.nostyle {
    text-decoration: none;
  }

  a.nostyle:hover {
    text-decoration: none;
    opacity: 1;
  }

  #app {
    font-family: 'Consolas', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    font-size: 16px;
    width: 75vw;
    margin-left: 12.5vw;
    display: flex;
    flex-direction: column;
    align-items: center;

  }

  .clock {
    /* Text */
    font-family: Segoe,Segoe UI,DejaVu Sans,Trebuchet MS,Verdana,sans-serif;
    font-size: 3em;
    margin-top: 20vh;
    color: var(--clock-color);
    margin-bottom: 10vh;
  }

  #search-box {
    /* Text */
    font-family: Segoe,Segoe UI,DejaVu Sans,Trebuchet MS,Verdana,sans-serif;
    font-size: 1.3em;
    resize: none;
    text-align: left;
    /* Display */
    width: 100%;
    height: 60px;
    padding: 0vw 2vw;
    margin-bottom: 2vh;
    /* Coloring / Styling */
    color: #2F4858;
    border-width: 0;
    outline: none;
    border-radius: 1px;
    -webkit-box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.4);
    -moz-box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.4);
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.4);
  }

  button {
    align-self: flex-end;
    padding: 0;
    border: none;
    font: inherit;
    color: inherit;
    background-color: transparent;
    cursor: pointer;
  }

  .btn__flat {
      text-decoration: none;
      margin: 2px 0;
      border: none;
      border-radius: 4px;
      padding: 0.5em 1em;
      transition: all 0.2s;
      color: var(--text-color);
      background-color: var(--bg-color);
  }

  .__align-right {
      text-align: right;
  }

  .__align-left {
      text-align: left;
  }

  .btn__flat:active {
      transform: translateY(2px);
  }

  .btn__flat:hover {
      background-color: var(--bg-color__light);
  }
  button:focus {
      outline: none;
  }

  #overlay {
    width: 80vw;
    min-height: 60%;
    max-height: 80%;
    overflow: scroll;
    background-color: rgba(255, 255, 255, 1);
    position: absolute;
    top: 10%;
    font-family: sans-serif;
    box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  }

  #overlay .title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-family: Roboto, sans-serif;
    font-size: 2em;
    font-weight: 200;
    margin-bottom: 3vh;
    padding: 2vh 8px 2vh 8px;
    color: #fff;
    background-color: var(--text-color);
  }

  #overlay .subtitle {
    text-align: center;
    font-family: sans-serif;
    font-size: 1em;
    font-weight: 200;
    margin-top: 0;
    margin-bottom: 3vh;
    color: var(--text-color);
  }

  #overlay .key {
    color: var(--bg-color);
    background: var(--text-color);
    padding: 2px 4px 3px 4px;
    border-radius: 5px;
  }

  section#commandListingContainer {
    width: 90%;
    padding-right: 5%;
    padding-left: 5%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  section .commandList {
    min-width: 30%;
    color: var(--text-color);
  }

  section .commandList dd {
    margin-bottom: 16px;
    list-style: none;
    margin-inline-start: 0;
    margin-left: 0;
  }

  section .commandList h3 {
    text-align: center;
    font-family: sans-serif;
  }

  section .commandList .command {
    font-family: monospace;
    font-size: 0.8em;
    color:  var(--alt-text-color);
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

  .phil-denhoff-logo {
    @import url('https://fonts.googleapis.com/css?family=Playfair+Display:900');
    font-family: 'Playfair Display';
    font-weight: 900;
    font-size: 1.6em;
    color: #000;
    line-height: 0.2em;
    margin-top: 2vh;
    cursor: default;
    text-decoration: none;
  }

  .logo-lead-in {
    margin-block-end: 0em;
    color: var(--text-color);
    opacity: 0.8;
    font-family: Roboto;
  }

  .credit {
    position: static;
    text-align: center;
    margin-top: 80px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  .exit {
    width: 20px;
    height: 20px;
    left: 50%;
    top: -6px;
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg viewPort='0 0 20 20' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='1' y1='20' x2='20' y2='1' stroke='white' stroke-width='2'/%3E%3Cline x1='1' y1='1' x2='20' y2='20' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
  }

  header>h1 {
    margin-block-start: 0;
    margin-block-end: 0;
    font-weight: inherit;
    font-size: inherit;
    max-height: 1em;
  }

  // Customize for Desktops
  @media only screen and (min-width: 600px) {
    #app {
      width: 50vw;
      margin-left: 25vw;
    }

    .clock {
      font-size: 6em;
    }

    #search-box {
      font-size: 1.625 em;
      height: 10vh;
    }

    section#commandListingContainer {
      flex-direction: row;
    }
  }

</style>
