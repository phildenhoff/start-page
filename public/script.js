// ------ Basic startup ------ //
var pomodoroTimer; // seconds in pomodoro timer (25 * 60, 5 * 60)
var POMODORO_COUNT = 0 // successfully completed pomodoro rounds (25 + 5)
var DEFAULTTITLE = "get started"

window.onload = function() {
  clock();
  notifyTitle();
}

// ------ Basic input handling ------ //

function keyDown(e) {
  var keycode;
  if (window.event) {
    keycode = window.event.keyCode;
  } else if (e) {
    keycode = e.which;
  }

  // pressed enter key?
  if (keycode == 13) {
    interpret();
  }
}

function interpret() {
  input = document.getElementById('search-box').value
  // has text?
  if (input === '') {
    showHelp();
    return;
  }
  var inputArray = input.split(';');
  if (isValidCommand(inputArray[0])) {
    try {
      commandHandler(cmd=inputArray[0], args=inputArray[1]);
    } catch (err) {
      console.log(err);
    }
  } else {
    // check if text is help,
    // and if not Google the text
    if (inputArray.length > 1) {
      displayError(`'${inputArray[0]}' is not a valid command`);
      clearInput();
      return;
    }
    if (input.toLowerCase() === "help") {
      showHelp();
    } else {
      searchCommand("g", input);
    }
  }
  clearInput();
}

function showHelp(cmd) {
  // TODO replace with help overlay

  // print help to console
  if (cmd) {
    console.log(COMMANDS[cmd]["helpDesc"] + " | " + COMMANDS[cmd]["helpCommand"]);
  } else {
    for (var cmd in COMMANDS) {
      var command = COMMANDS[cmd], helpDesc, helpCommand;
      if (command["type"] === "search") {
        // fill in optional text for search
        helpCommand = command["helpCommand"] ? command["helpCommand"] : cmd + ";[query]";
        helpDesc = command["helpDesc"] ? command["helpDesc"] : "Search " + command["title"];
      } else {
        helpCommand = command["helpCommand"] ? command["helpCommand"] : "[COMMAND MISSING]";
        helpDesc = command["helpDesc"] ? command["helpDesc"] : "[DESCRIPTION MISSING]";
        if (!command["helpCommand"] && !command["helpDesc"]) {
          // avoid printing missing command and description
          continue;
        }
      }
      console.log(helpDesc + " | " + helpCommand);
    }
  }
  notify("Check the log for further help", "More info");
}


function clearInput() {
  document.getElementById('search-box').value = "";
}

// ------ Display & Notifications ------ //

function notify(message, msgTitle) {
  // TODO replace with drop-down notification
  msgTitle = (msgTitle) ? msgTitle : "Notification";
  vNotify.notify({text:message, title:msgTitle});
}

function displayError(error, errorTitle) {
  // TODO replace with red drop-down bar
  errorTitle = (errorTitle) ? errorTitle : "Error";
  vNotify.error({text:error, title:errorTitle});
}

function notifyTitle(message) {
  console.log("updating title");
  if (typeof message == 'undefined') {
    window.document.title = DEFAULTTITLE;
    return;
  }
  window.document.title = message;
}

// ------ Command Handling ------ //

function isValidCommand(cmd) {
  if (cmd in COMMANDS) {
    return true;
  } else {
    return false;
  }
}

function commandHandler(cmd, args) {
  /* Assumes command is valid. Runs additional function depending on
  what type the command is. */
  var command = COMMANDS[cmd]
  try {
    switch (command["type"]) {
      case "search":
      searchCommand(cmd, args);
      break;
      case "local":
      localCommand(cmd, args);
      break;
      case "browser":
      browserCommand(cmd, args);
      break;
      default:
        throw "Invalid command type";
        break;
    }
  } catch (err) {
    if (err.name === "BadArgument") {
      displayError(err.message);
      showHelp();
    }
  }

  return;
}

function searchCommand(cmd, args) {
  var command = COMMANDS[cmd];
  if (args.replace(/\s/g, '') != "") {
    var santisedText = santise(args);
    var url = command["url"] + command["search"] + santisedText;
  } else {
    var url = command["url"];
  }
  redirect(url, true);
}

function localCommand(cmd, args) {
  // console.log("local command " + cmd + " with args " + args);
  // console.log("Usage: " + COMMANDS[cmd]["helpCommand"]);
  if (!true) {
    // error handling for bad arguments
    throw {
      name:"BadArgument",
      message:"Invalid arguments for " + cmd
    }
  }
}

function browserCommand(cmd, args) {
  // console.log("On page command " + cmd + " with args " + args);
  // console.log("Usage: " + COMMANDS[cmd]["helpCommand"]);
  command = COMMANDS[cmd];
  if (window[command["functionName"]]) {
    window[command["functionName"]](cmd, args);
  } else {
    console.log("Function does not exist");
  }
}

function santise(args) {
  return args.replace(/\s/g, '+').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
}

// ------ Local Command Handling ------ //


// ------ Browser Command Handling ------ //
function redirect(url, newtab=true) {
  if (newtab === false) {
    window.location.href = url;
  } else {
    window.open(url, '_blank');
    console.log("New tab");
  }
}

function pomodoro(cmd, args) {
  var argArray = args.split(" ");
  if (argArray[0].toLowerCase() === "help") {
    showHelp(cmd);
    return;
  }
  switch (argArray[0]) {
    case "start":
      // default behaviour: 25 minute timer + 5 minute break
      // if arg is given, will run 25 + 5, arg times
      var durationQueue = [25, 5]
      // check for correct arg
      if (isFinite(argArray[1]) && parseFloat(argArray[1]) == argArray[1]) {
        if (argArray[1]) {
          for (i = 0; i < argArray[1] - 1; i++) {
            durationQueue.push(25);
            durationQueue.push(5);
          }
        }
      } else if (typeof argArray[1] !== 'undefined') {
        throw {
          name:"BadArgument",
          message:"Invalid duration \'" + argArray[1] +"\'"
        }
      }
      nextPomodoro(durationQueue);
      // check out http://stackoverflow.com/questions/16134997/how-to-pause-and-resume-a-javascript-timer
      break;
    case "reset":
      pomodoroTimer.reset();
      break;
    case "pause":
      pomodoroTimer.pause();
      break;
    case "resume":
      pomodoroTimer.resume();
      break;
    case "remove":
      deleteTimer(pomodoroTimer);
      break;
    default:
      throw {
        name:"BadArgument",
        message:"Subcommand \'"+ argArray[0] + "\' not recognized or missing argument"
    }
  }
}

// ------ Clock  & Timer ------ //
function clock() {
  // Set clock on landing page
  var formatTime = function (digit) {
    // Prepend clock hour or minute with 0 if single digit
    return (digit < 10) ? (digit = '0' + digit) : digit
  }
  var date = new Date();
  var hour = date.getHours();
  hour = (hour > 12) ? (formatTime(hour -= 12)) : formatTime(hour); // convert to 12 hour
  var min = formatTime(date.getMinutes());
  document.getElementById('clock').innerHTML = hour + ":" + min;
  setTimeout(clock, 1000);
}

function startTimer(seconds, onComplete, nextDurations) {
  /* oncomplete must at least accept nextDurations */
  var startTime, timer, obj, ms = seconds * 1000,
      display = document.getElementById("timer"), state, notify = true;
  obj = {};
  obj.resume = function () {
    state = 'resumed';
    startTime = new Date().getTime();
    timer = setInterval(obj.step, 250);
  };
  obj.delete = function () {
    ms = 0;
    onComplete = null;
    notify = false;
  }
  obj.reset = function() {
    ms = seconds * 1000;
    obj.resume();
  }
  obj.pause = function () {
    if (state === 'paused') return;
    state = 'paused';
    ms = obj.step();
    clearInterval(timer);
  }
  obj.step = function() {
    var now = Math.max(0, ms - (new Date().getTime() - startTime)),
      m = Math.floor(now / 60000), s = Math.floor(now / 1000) % 60;
    s = (s < 10 ? "0" : "") + s;
    if (now !== 0) {
      text = m + ":" + s
      display.innerHTML = text;
      notifyTitle(text);
    }
    if (now == 0) {
      clearInterval(timer);
      obj.resume = function() {};
      if (onComplete) onComplete(nextDurations, notify);
    }
    return now;
  }
  obj.resume();
  return obj;
}

function deleteTimer(pomodoroTimer) {
  pomodoroTimer.delete()
  container = document.getElementById("timerContainer")
  container.className = "fadeout";
  // remove excess additional timers
  var elements = container.getElementsByClassName("additionalTimer");
  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }
  document.getElementById('timer').innerHTML = "";
}

function nextPomodoro(durationQueue, timerFinished) {
  // notify user time is up
  if (timerFinished === true) {
    var audio = new Audio("sounds/345815__vendarro__alarm-no.mp3");
    audio.play();
    notify("BZZ BZZ, BZZ BZZ");
  }
  // hide container & timers
  container = document.getElementById("timerContainer")
  container.className += " fadeout";
  // remove excess additional timers
  var elements = container.getElementsByClassName("additionalTimer");
  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }
  // return if no more timers
  if (durationQueue.length === 0) return;
  // otherwise, fadein timer and then add queue
  document.getElementById('timer').innerHTML = durationQueue[0]+":00";
  container.className = "fadein"
  for (var i = 1; i < durationQueue.length && i < 4; i++) {
    var additionalTimer = document.createElement('span');
    additionalTimer.innerHTML = durationQueue[i]+":00";
    additionalTimer.className = "additionalTimer";
    additionalTimer.className += " fadein";
    document.getElementById('timerContainer').append(additionalTimer)
  }
  // remove current timer from queue
  duration = durationQueue.shift();
  // begin timering
  if (pomodoroTimer) pomodoroTimer.delete(); // prevent timer from having multiple durations
  pomodoroTimer = startTimer(duration*60, nextPomodoro, durationQueue);
}
