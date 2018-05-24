import Vue from 'vue'
import App from './App.vue'
import Notifications from 'vue-notification'

Vue.use(Notifications)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    mounted: function () {
        var vm = this
        window.addEventListener('keyup', function (event) {
            if (event.keyCode === 27) {
                vm.$emit('hide_help')
            }
        })
    },
    render: h => h(App)
})
