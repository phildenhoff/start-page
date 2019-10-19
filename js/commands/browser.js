/** Run given function based on commandInfo
 *
 * @param {string} commandInfo Javascript Object for requested command
 * @param {string} userCommand Shortcut key of command
 * @param {*} tokens Selection of input for user
 * @param {*} vm Vue context
 */
const browser = {
    defaultFunction: function (commandInfo, userCommand, tokens, vm) {
        if (typeof browser.hiddenFunctions[commandInfo.functionName] !== 'undefined') {
            browser.hiddenFunctions[commandInfo.functionName](commandInfo, userCommand, tokens, vm)
        } else {
            browser.hiddenFunctions.notify('', '', 'Function ' + commandInfo.functionName +
            ' missing.,The function is not available in browser.js. Check your naming.')
        }
    },
    hiddenFunctions: {
        pomodoro: function (a, b, c, vm) {
            this.notify(null, null, 'Function missing,This feature has not yet been implemented.', null)
        },
        /**
         * Simple notification command, split by commas.
         */
        notify: function (_, _, tokens, _) {
            let [title, body] = tokens.split(',')

            // Check that the browser supports the Notification API
            if (!("Notification" in window)) return;

            const notificationOptions = {
                body
            }

            if (Notification.permission === "granted") new Notification(title, notificationOptions)
            else if (Notification.permission !== "denied" || Notification.permission === "default") {
                Notification.requestPermission().then(result => {
                    if (result === "denied") return;
                    if (result === "default") return;
                    new Notification(title, notificationOptions)
                })
            }
        }
    },
    pd: {
        'type': 'browser',
        'command': 'pd',
        'functionName': 'pomodoro',
        'title': 'Pomodoro',
        'helpCommand': 'pd;[start (number of timers)] [reset] [pause] [resume]',
        'helpDesc': 'Start, reset, or pause a Pomodoro timer' // optional, defaults to 'Search [TITLE]'
    },
    notify: {
        'type': 'browser', // TODO: make programmatically defined
        'command': 'ntfy',
        'functionName': 'notify',
        'title': 'Notify',
        'helpDesc': 'Simple comma-delimted notifications.',
        'helpCommand': 'notify;[title],[body]'
    }
}