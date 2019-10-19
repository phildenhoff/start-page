var container = new Vue({
    el: '#container',
    watch: {},
    data: {
        msg: 'Hello'
    },
    methods: {},
    mounted: function () {
        var vm = this
        window.addEventListener('keyup', function (event) {
            if (event.keyCode === 27) {
                vm.$emit('hide_help')
            }
        })
    },
    render: h => h(app)
})

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