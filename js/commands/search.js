const search = {
    defaultFunction: function (commandInfo, userCommand, tokens, vm) {
        // Santize tokens
        const cleanTokens = tokens.trim().replace(/\s/g, '+').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

        let url
        // check that tokens is not empty. If it is, only go to base url
        if (cleanTokens.length > 0) {
            url = commandInfo.baseUrl + commandInfo.search + cleanTokens
        } else {
            url = commandInfo.baseUrl
        }
        window.open(url, '_blank')
    },
    g: {
        'type': 'search',
        'command': 'g',
        'baseUrl': 'https://www.google.ca',
        'search': '/search?q=',
        'title': 'Google',
        'helpCommand': 'g;[query]', // optional, defaults to '[COMMAND];[query]'
        'helpDesc': 'Search Google' // optional, defaults to 'Search [TITLE]'
    },
    yt: {
        'type': 'search',
        'command': 'yt',
        'baseUrl': 'https://www.youtube.com',
        'search': '/results?search_query=',
        'title': 'YouTube',
        'helpDesc': 'Search YouTube'
    },
    plex: {
        'type': 'search',
        'command': 'plex',
        'baseUrl': 'https://app.plex.tv/web/app#',
        'search': '!/server/308101523183f80723efc9ce7e5e37c4371943a1/search/',
        'title': 'Plex',
        'helpDesc': 'Search Plex'
    },
    r: {
        'type': 'search',
        'command': 'r',
        'baseUrl': 'https://www.reddit.com',
        'search': '/r/',
        'title': 'Reddit',
        'helpCommand': 'r;[subreddit]',
        'helpDesc': 'Go to subreddit'
    },
    dr: {
        'type': 'search',
        'command': 'dr',
        'baseUrl': 'https://drive.google.com/',
        'search': 'drive/u/0/search?q=',
        'title': 'Google Drive'
    },
    wa: {
        'type': 'search',
        'command': 'wa',
        'baseUrl': 'https://www.wolframalpha.com',
        'search': '/input/?i=',
        'title': 'Wolfram|Alpha'
    },
    ha: {
        'type': 'search',
        'command': 'ha',
        'baseUrl': 'https://hangouts.google.com',
        'search': '',
        'title': 'Hangouts',
        'helpCommand': 'ha;', // optional, defaults to '[COMMAND];[query]'
        'helpDesc': 'Open Hangouts' // optional, defaults to 'Search [TITLE]'
    },
    am: {
        'type': 'search',
        'command': 'h',
        'baseUrl': 'https://www.amazon.ca',
        'search': '/s/ref=nb_sb_noss_2?baseUrl=search-alias%3Daps&field-keywords=',
        'title': 'Amazon',
        'helpCommand': 'am;[product]',
        'helpDesc': 'Search Amazon'
    },
    fcc: {
        'type': 'search',
        'command': 'fcc',
        'baseUrl': 'https://www.freecodecamp.com/',
        'search': '',
        'title': 'Free Code Camp',
        'helpCommand': 'fcc;',
        'helpDesc': 'Open Free Code Camp'
    },
    u: {
        'type': 'search',
        'command': 'u',
        'baseUrl': 'https://',
        'search': '',
        'title': 'URL',
        'helpDesc': 'Open URL'
    },
    hw: {
        'type': 'search',
        'command': 'hw',
        'baseUrl': 'https://myhomeworkapp.com/home',
        'search': '',
        'title': 'myHomework',
        'helpDesc': 'Open myHomework'
    }

}