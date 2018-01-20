<template>
  <div id="app" v-on:keyup.esc="hide_help">
    <span id="clock"> {{ time }}</span>
    <input id='search-box' v-model="cmd" v-on:keyup.enter="parseCmd" v-on:keyup.up="show_prev_cmd" v-on:keyup.down="show_next_cmd" autofocus autocomplete="off" autocapitalize="none" size="30" placeholder="help">
    
    <transition name="fade">
      <div id="overlay" v-if="display_help === true" v-on:click="hide_help">
        <h1 class="title">Help</h1>
          <h3 class="subtitle">Press esc to close.</h3>
          <section id="commandListingContainer">
              <section class="commandList">
                  <h3>Search</h3>
                  <ul id="searchList">
                  </ul>
              </section>
              <section class="commandList">
                  <h3>Browser</h3>
                  <ul id="browserList">
                  </ul>
              </section>
              <section class="commandList">
                  <h3>Local</h3>
                  <ul id="localList">
                  </ul>
              </section>
          </section>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      time: '00:00',
      cmd: '',
      cmd_history: [],
      cmd_index: 0,
      display_help: false,
    }
  },
  methods: {
    parseCmd: function () {
      console.log(this.time, this.cmd);
      if (this.cmd === '' || this.cmd.toLowerCase() === 'help') {
        this.showHelp();
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
    showHelp: function () {
      console.log("Showing help");
      this.display_help = true;
    },
    hide_help: function() {
      console.log("Hiding the help menu!");
      this.display_help = false;
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
    height: 100%;
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
    padding: 2px 4px 3px 3px;
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
