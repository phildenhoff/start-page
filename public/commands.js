var COMMANDS = {
  "g":{
    "type":"search",
    "command":"g",
    "url":"https://www.google.ca",
    "search":"/search?q=",
    "title":"Google",
    "helpCommand":"g;[query]", // optional, defaults to "[COMMAND];[query]"
    "helpDesc":"Search Google", // optional, defaults to "Search [TITLE]"
  },
  "yt":{
    "type":"search",
    "command":"yt",
    "url":"https://www.youtube.com",
    "search":"/results?search_query=",
    "title":"YouTube",
  },
  "plex":{
    "type":"search",
    "command":"plex",
    "url":"https://app.plex.tv/web/app#",
    "search":"!/server/308101523183f80723efc9ce7e5e37c4371943a1/search/",
    "title":"Plex",
  },
  "dr":{
    "type": "search",
    "command": "dr",
    "url": "https://drive.google.com/",
    "search": "drive/u/0/search?q=",
    "title": "Google Drive"
  },
  "r":{
    "type":"search",
    "command":"r",
    "url":"https://www.reddit.com",
    "search":"/r/",
    "title":"Reddit",
    "helpCommand":"r;[subreddit]",
    "helpDesc":"Go to subreddit",
  },
  "wa":{
    "type":"search",
    "command":"wa",
    "url":"https://www.wolframalpha.com",
    "search":"/input/?i=",
    "title":"Wolfram|Alpha"
  },
  "i":{
    "type":"search",
    "command":"i",
    "url":"https://inbox.google.com",
    "search":"/search/",
    "title":"Google Inbox",
    "helpDesc":"Search your Google Inbox",
  },
  "h":{
    "type":"search",
    "command":"h",
    "url":"https://hangouts.google.com",
    "search":"",
    "title":"Hangouts",
    "helpCommand":"h;", // optional, defaults to "[COMMAND];[query]"
    "helpDesc":"Open Hangouts", // optional, defaults to "Search [TITLE]"
  },
  "am":{
    "type":'search',
    "command":"h",
    "url":"https://www.amazon.ca",
    "search":"/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=",
    "title":"Amazon",
    "helpCommand":"am;[product]",
    "helpDesc":"Search Amazon"
  },
  "fcc":{
  	"type":"search",
  	"command":"fcc",
  	"url":"https://www.freecodecamp.com/",
  	"search":"",
  	"title":"Free Code Camp",
  	"helpCommand":"fcc;",
  	"helpDesc":"Open Free Code Camp"
  },
  "pty":{
    "type":"local",
    "command":"pty",
    "functionName":"execPutty",
    "title":"Putty",
    "helpCommand":"pty;[server name]",
    "helpDesc":"Start putty, optionally start direct putty connection with a server", // optional, defaults to "Search [TITLE]"
  },
  "pd":{
    "type":"browser",
    "command":"pd",
    "functionName":"pomodoro",
    "title":"Pomodoro",
    "helpCommand":"pd;[start (number of timers)] [reset] [pause] [resume]",
    "helpDesc":"Start, reset, or pause a Pomodoro timer", // optional, defaults to "Search [TITLE]"
  }
}
