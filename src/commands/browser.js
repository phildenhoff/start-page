/** Run given function based on commandInfo
 *
 * @param {string} commandInfo Javascript Object for requested command
 * @param {string} userCommand Shortcut key of command
 * @param {*} tokens Selection of input for user
 * @param {*} vm Vue context
 */
export const defaultFunction = function (commandInfo, userCommand, tokens, vm) {
    if (typeof hiddenFunctions[commandInfo.functionName] !== 'undefined') {
        hiddenFunctions[commandInfo.functionName](commandInfo, userCommand, tokens, vm)
    } else {
        hiddenFunctions.notify('', '', 'Function ' + commandInfo.functionName +
        ' missing.,The function is not available in browser.js. Check your naming.')
    }
}

export const hiddenFunctions = {
    pomodoro: function (a, b, c, vm) {
        this.notify('', '', 'Function missing,This feature has not yet been implemented.', vm)
    },
    /**
     * Simple notification command, split by commas.
     * If no type is designated, defaults to custom warning.
     */
    notify: function (commandInfo, userCommand, tokens, vm) {
        let [title, text, type] = tokens.split(',')
        if (typeof type === 'undefined') type = 'warning'
        vm.$notify({
            group: 'notify',
            title,
            type,
            text
        })
    }
}

export const pd = {
    'type': 'browser',
    'command': 'pd',
    'functionName': 'pomodoro',
    'title': 'Pomodoro',
    'helpCommand': 'pd;[start (number of timers)] [reset] [pause] [resume]',
    'helpDesc': 'Start, reset, or pause a Pomodoro timer' // optional, defaults to 'Search [TITLE]'
}

export const notify = {
    'type': 'browser', // TODO: make programmatically defined
    'command': 'ntfy',
    'functionName': 'notify',
    'title': 'Notify',
    'helpDesc': 'Simple comma-delimted notifications.',
    'helpCommand': 'notify;[title],[text],[type]'
}
