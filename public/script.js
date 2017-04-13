// ------ Basic startup ------ //
POMODORO_TIMER = 0; // seconds in pomodoro timer (25 * 60, 5 * 60)
POMODORO_COUNT = 0 // successfully completed pomodoro rounds (25 + 5)

window.onload = function() {
  clock();
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
      displayError(inputArray[0] + " is not a valid command");
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
}

function displayError(error) {
  // TODO replace with red drop-down bar
  alert(error);
}

function clearInput() {
  document.getElementById('search-box').value = "";
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
  console.log("local command " + cmd + " with args " + args);
  console.log("Usage: " + COMMANDS[cmd]["helpCommand"]);
  if (!true) {
    // error handling for bad arguments
    throw {
      name:"BadArgument",
      message:"Invalid arguments for " + cmd
    }
  }
}

function browserCommand(cmd, args) {
  console.log("On page command " + cmd + " with args " + args);
  console.log("Usage: " + COMMANDS[cmd]["helpCommand"]);
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
  if (argArray.length < 2 && argArray[0].toLowerCase() != "pause") {
    throw {
      name:"BadArgument",
      message:"Insufficient argument length for " + cmd
    }
  } else {
    switch (argArray[0]) {
      case "start":
        n = argArray[1];
        if (isFinite(n) && parseFloat(n) == n) {
          console.log("Setting timer for " + n + " minutes");
          // but not actually
          // check out http://stackoverflow.com/questions/16134997/how-to-pause-and-resume-a-javascript-timer
          // for a possible timer?
        } else {
          throw {
            name:"BadArgument",
            message:"Invalid duration "+ n
          }
        }
        break;
      case "reset":
        // reset timer
        break;
      case "pause":
        // pause timer
        break;
      default:
        throw {
          name:"BadArgument",
          message:"Subcommand \'"+ argArray[0] + "\' not recognized or missing argument"
      }
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

function startTimer(seconds, container, oncomplete) {
  var startTime, timer, obj, ms = seconds * 1000, display = document.getElementById(container);
  obj = {};
  obj.resume = function () {
    startTime = new Date().getTime();
    timer = setInterval(obj.step, 250);
  };
  obj.pause = function () {
    ms = obj.step();
    clearInterval(timer);
  }
  obj.step = function() {
    var now = Math.max(0, ms - (new Date().getTime() - startTime)),
      m = Math.floor(now / 60000), s = Math.floor(now / 1000) % 60;
    s = (s < 10 ? "0" : "") + s;
    display.innerHTML = m + ":" + s;
    if (now == 0) {
      clearInterval(timer);
      obj.resume = function() {};
      if ( oncomplete ) oncomplete();
    }
    return now;
  }
  obj.resume();
  return obj;
}
