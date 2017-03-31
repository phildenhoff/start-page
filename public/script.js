window.onload = function() {
  clock();
}




// ------ Clock ------ //
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
