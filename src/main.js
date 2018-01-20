import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  mounted: function() {
    console.log("Ready!");
    var vm = this;
    window.addEventListener('keyup', function(event) {
      if (event.keyCode == 27) {
        vm.$emit('hide_help');
      }
    });
  },
  render: h => h(App)
})
