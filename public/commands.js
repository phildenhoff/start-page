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
    "helpCommand":"pd;[start (number)] [reset (timer | counter)] [pause]",
    "helpDesc":"Start, reset, or pause a Pomodoro timer", // optional, defaults to "Search [TITLE]"
  }
}
