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
    "search":"!/server/0ac7620c43f42bb4ffa9d2cc861be1ea823aefc0/search/",
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
