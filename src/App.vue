<template>
  <div id="app" v-on:keyup.esc="hide_help">
    <span id="clock"> {{hours}}:{{minutes}}</span>
    <input id='search-box' v-model="cmd" v-on:keyup.enter="parseCmd" v-on:keyup.up="show_prev_cmd" v-on:keyup.down="show_next_cmd" autofocus autocomplete="off" autocapitalize="none" size="30" placeholder="help">
    
    <transition name="fade">
      <div id="overlay" v-if="display_help === true" v-on:click="hide_help">
        <h1 class="title">Help</h1>
          <h3 class="subtitle">Press <span class="key">esc</span> to close.</h3>
          <section id="commandListingContainer">
              <section class="commandList" v-for="category in command_categories" :key="category.title">
                <h3>{{category.title}}</h3>
                <ul id="searchList">
                   <li v-for="cmd in category.list" :key="cmd.command">
                      {{ cmd.helpDesc || "Search " + cmd.title }}  <br />
                      <span class="command">{{ cmd.helpCommand }}</span>
                    </li> 
                </ul>
              </section>
          </section>
      </div>
    </transition>
  </div>
</template>

<script>
import * as search from './commands/search.js'
import * as browser from './commands/browser.js'
import * as remote from './commands/remote.js'


function padZero(num) {
  if (num < 10) {
    return '0' + num;
  } else return num;
}

function getDate() {
  return new Date();
}

function getMinutes() {
  return padZero(getDate().getMinutes());
}

function getHour() {
  return padZero(getDate().getHours() % 12);
}

function auto_populate(cmd_list, command_file, list_name, vue_context) {
  for (let val of Object.getOwnPropertyNames(command_file)) {
    if (val === "__esModule") continue;
    cmd_list[val] = command_file[val];
    if (!cmd_list[val]["helpCommand"]) {
      cmd_list[val]["helpCommand"] = val + ";[query]";
    }
  };

  vue_context.command_categories.push({title: list_name, list:cmd_list});

}

export default {
  name: 'app',
  data () {
    return {
      cmd: '',
      cmd_history: [],
      cmd_index: 0,
      display_help: false,
      minutes: '00',
      hours: '00',
      search_cmds: {},
      browser_cmds: {},
      remote_cmds: {},
      command_categories: []
    }
  },
  methods: {
    parseCmd: function () {
      console.log(this.time, this.cmd);
      if (this.cmd === '' || this.cmd.toLowerCase() === 'help') {
        this.show_help();
        return;
      }
      this.cmd_history.unshift(this.cmd);
      this.cmd = '';
      this.cmd_index = 0;
      console.log(this.cmd_history)
    },
    show_prev_cmd: function() {
      this.cmd = this.cmd_history[this.cmd_index];
      if (this.cmd_index < this.cmd_history.length - 1) this.cmd_index++;
      console.log(this.cmd);
    },
    show_next_cmd: function() {
      if (this.cmd_index > 0) {
        this.cmd_index--;
        this.cmd = this.cmd_history[this.cmd_index];
      } else {
        this.cmd = '';
        this.cmd_index = 0;
      }
    },
    show_help: function () {
      console.log("Showing help");
      this.display_help = true;
    },
    hide_help: function() {
      console.log("Hiding the help menu!");
      this.display_help = false;
    }
  },
  created: function () {
    // Set timer for clock
    var vm = this;
    setInterval(() => {
      vm.minutes = getMinutes();
      vm.hours = getHour();
    }, 1000);

    // Load history from LocalStorage
    if (localStorage.getItem('history')) {
      this.cmd_history = JSON.parse(localStorage.getItem('history'));
    }

    // Auto populate based on search file
    auto_populate(this.search_cmds, search, 'Search', vm);
    auto_populate(this.browser_cmds, browser, 'Browser', vm);
    auto_populate(this.remote_cmds, remote, 'Remote', vm);
  },
  watch: {
    cmd_history: function () {
      localStorage.setItem('history', JSON.stringify(this.cmd_history));
    } 
  }
}
</script>

<style lang="scss">

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
    font-family: Segoe, "Segoe UI", "DejaVu Sans", "Trebuchet MS", Verdana, sans-serif;
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
    background-color: #F26419;
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
    color: var(--text-color);
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
