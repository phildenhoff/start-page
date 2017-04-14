# start-page
It's a startpage / new tab page I'm builing to practice my JS skills.

[Check out a live version](https://www.denhoff.ca/start/public)

Interaction is done via a command line in the center. Type `help` to receive a list of commands (check console). All commands are input by 
```
(command shorthand);[(optional arguments)]
```
ie
```
yt;interior crocodile alligator
```
will search YouTube for "interior corocdile alligator".

There are (currently) three types of commands

 - search, which takes you to a keyword search page
 - browser, which does some kind of on-page interaction such as a pomodoro timer (pd;)
 - local, which executes code on the server machine.
 
 Likely the local commands will mostly be pre-determined to update my server's media info, but it's more focused towards allowing the user running a Node.JS server on their local machine in the background to open up programs and execute pre-determined commands.
 
 
 Templates for command types:
 
 search:
 
| JSON name | data | required? | description |
| --- | --- | --- | --- |
| type | search | Y | Describes type of command |
| url | url | Y | Base URL of the website |
| search | search-addition | Y | The portion of the URL which precedes the keywords |
| command | x | Y | What the user types before a semicolon and their query |
| title | Name | Y| The name of the website |
| help-cmd | x; (query) | N | An example of how to use the command, best if describing all options |
| help-desc | Search (title) | N | Describes what the command does |

browser:

| JSON name | data | required? | description |
| --- | --- | --- | --- |
| type | browser | Y | Describes type of command |
| command | y | Y | What the user types before a semicolon and their query |
| title | Name | Y| The name of the command |
| function_name | function_y | Y | The function to run from the JS file |
| help-cmd | y;(operands) | N | An example of how to use the command, best if describing all options |
| help-desc | Run (title) | N | Describes what the command does |


local:

| JSON name | data | required? | description |
| --- | --- | --- | --- |
| type | browser | Y | Describes type of command |
| command | z | Y | What the user types before a semicolon and their query |
| title | Name | Y| The name of the command |
| function_name | server_function_z | Y | The function to run from the JS file |
| help-cmd | z;(operands) | N | An example of how to use the command, best if describing all options |
| help-desc | "Run (title) locally" | N | Describes what the command does |

Note that although `help-desc` and `help-cmd` are both optional, if neither is listed the command will not show up in the help menu (except for search commands).
