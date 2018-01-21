export const default_function = function(command_info, user_cmd, tokens, vm) {
    // Santize tokens
    const clean_tokens = tokens.trim().replace(/\s/g, '+').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

    let url;
    // check that tokens is not empty. If it is, only go to base url
    if (clean_tokens.length > 0) {
        url = command_info.baseUrl + command_info.search + clean_tokens;
    } else {
        url = command_info.baseUrl;
    }
    window.open(url, '_blank');
};

export const g = {
    'type':'search',
    'command':'g',
    'baseUrl':'https://www.google.ca',
    'search':'/search?q=',
    'title':'Google',
    'helpCommand':'g;[query]', // optional, defaults to '[COMMAND];[query]'
    'helpDesc':'Search Google', // optional, defaults to 'Search [TITLE]'
};

export let yt = {
    'type':'search',
    'command':'yt',
    'baseUrl':'https://www.youtube.com',
    'search':'/results?search_query=',
    'title':'YouTube',
};

export let plex = {
    'type':'search',
    'command':'plex',
    'baseUrl':'https://app.plex.tv/web/app#',
    'search':'!/server/308101523183f80723efc9ce7e5e37c4371943a1/search/',
    'title':'Plex',
};

export let r = {
    'type':'search',
    'command':'r',
    'baseUrl':'https://www.reddit.com',
    'search':'/r/',
    'title':'Reddit',
    'helpCommand':'r;[subreddit]',
    'helpDesc':'Go to subreddit',
};

export let dr = {
    'type': 'search',
    'command': 'dr',
    'baseUrl': 'https://drive.google.com/',
    'search': 'drive/u/0/search?q=',
    'title': 'Google Drive'
};

export let wa= {
    'type':'search',
    'command':'wa',
    'baseUrl':'https://www.wolframalpha.com',
    'search':'/input/?i=',
    'title':'Wolfram|Alpha'
};

export let i = {
    'type':'search',
    'command':'i',
    'baseUrl':'https://inbox.google.com',
    'search':'/search/',
    'title':'Google Inbox',
    'helpDesc':'Search your Google Inbox',
};

export let ha = {
    'type':'search',
    'command':'ha',
    'baseUrl':'https://hangouts.google.com',
    'search':'',
    'title':'Hangouts',
    'helpCommand':'ha;', // optional, defaults to '[COMMAND];[query]'
    'helpDesc':'Open Hangouts', // optional, defaults to 'Search [TITLE]'
};

export let am = {
    'type':'search',
    'command':'h',
    'baseUrl':'https://www.amazon.ca',
    'search':'/s/ref=nb_sb_noss_2?baseUrl=search-alias%3Daps&field-keywords=',
    'title':'Amazon',
    'helpCommand':'am;[product]',
    'helpDesc':'Search Amazon'
};

export let fcc = {
    'type':'search',
    'command':'fcc',
    'baseUrl':'https://www.freecodecamp.com/',
    'search':'',
    'title':'Free Code Camp',
    'helpCommand':'fcc;',
    'helpDesc':'Open Free Code Camp'
};

export let u = {
    'type':'search',
    'command':'u',
    'baseUrl':'https://',
    'search':'',
    'title':'URL',
};