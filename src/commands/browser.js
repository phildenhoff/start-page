/** Run given function based on command_info
 * 
 * @param {string} command_info Javascript Object for requested command
 * @param {string} user_cmd Shortcut key of command
 * @param {*} tokens Selection of input for user
 * @param {*} vm Vue context
 */
export const default_function = function(command_info, user_cmd, tokens, vm) {
    if (typeof _hidden_functions[command_info.functionName] !== 'undefined') {
        _hidden_functions[command_info.functionName](command_info, user_cmd, tokens, vm);
    } else {
        _hidden_functions.notify('', '', 'Function ' + command_info.functionName +' missing.,The function is not available in browser.js. Check your naming.');
    }
}

export const _hidden_functions = {
    pomodoro: function (a, b, c, vm) {
        this.notify('', '', 'Function missing,This feature has not yet been implemented.', vm);
    },
    /**
     * Simple notification command, split by commas.
     * If no type is designated, defaults to custom warning.
     */
    notify: function (command_info, user_cmd, tokens, vm) {
        let [title, text, type] = tokens.split(',');
        if (typeof type === 'undefined') type = 'warning';
        vm.$notify({
            group: 'notify',
            title,
            type,
            text
      });
    }
}

export const pd = {
    'type':'browser',
    'command':'pd',
    'functionName':'pomodoro',
    'title':'Pomodoro',
    'helpCommand':'pd;[start (number of timers)] [reset] [pause] [resume]',
    'helpDesc':'Start, reset, or pause a Pomodoro timer', // optional, defaults to 'Search [TITLE]'
};

export const notify = {
    'type': 'browser', // TODO: make programmatically defined
    'command':'ntfy',
    'functionName': 'notify',
    'title': 'Notify',
    'helpDesc': 'Simple comma-delimted notifications.',
    'helpCommand': 'notify;[title],[text],[type]'
}
