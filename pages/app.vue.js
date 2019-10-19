var app = Vue.component("App", {
    template: `
    <div id="app">
        <span class='clock'> {{hours}}:{{minutes}}</span>
        <input id='search-box' v-model='cmd' v-on:keyup.enter='parseCmd' v-on:keyup.up='show_prev_cmd' v-on:keyup.down='show_next_cmd' autofocus autocomplete='off' autocapitalize='none' size='30' placeholder='get started...'>
        <button class='btn__flat __align-right' v-on:click='show_help'>Help</button>

        <aside class="credit">
            <p class="logo-lead-in">Made by</p>
            <div class='btn__flat __align-left'>
            <a class="nostyle phil-denhoff-logo" href="https://denhoff.ca">Phil<br>Denhoff</a>
            </div>
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
    </div>`,
    data() {
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
        console.log("hi!")
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
});