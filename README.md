# clashing-coders-rpg
Server implementation of our first coding contest.

We host this here because of popular demand to make the examples of our contest available. You might need some knowledge about server components, but for once we expect anyone that takes a contest like that to be able to figure those out; also we will walk you through it as good as we can ;)

# Installation
## Requirements
 - nodejs > 0.12
 - redis
 - postgres
 
The platform itself is written purely in javascript and running on nodejs. Since we used 7 instances on site to be able to bear the load of 50+ users barraging us with movement requests, the server uses redis as a storage for login sessions. Postgres is used as a persistant storage for user and level metadata (clear time, fails).

## Setup
Assuming you have the above requirements installed and you have the repository cloned, you first have to prepare the database.
```sql
CREATE DATABASE clashing_coders
```
should take care of the database; then simply run the provided setup.sql against that database to set up the necessary tables.
Then you should insert yourself a user into the users table, so you will be able to authenticate against the API later. Passwords are stored in plain text as we generated random passwords for the contest and never planned on exposing them for longer than the contest itself.

Make sure postgres and redis are running then run
```bash
node start.js
```
to start up the server. The server runs on localhost:8888 by default.

To open authentication, open the redis cli and set off
```redis
set open-registration true
```
to allow users to authenticate.

## Additional views
If you want to have access to the management views for whatever reason you need a few more steps. First, you need a webserver of your choice to serve static files and redirects to the node service for everything else. We used nginx for that and a usable config module is provided in the repository. Just make sure to adapt the path in the config file to the location you cloned the repository to and link or copy it to your nginx config directory (usually `/etc/nginx/conf.d`). This is assuming you are using NGINX's default config which should come with a section like so:
```nginx
# Load modular configuration files from the /etc/nginx/conf.d directory.
# See http://nginx.org/en/docs/ngx_core_module.html#include
# for more information.
include /etc/nginx/conf.d/*.conf;
```
within the http section to include modular configuration files from a directory. If you are running a different configuration, suite yourself :)

# How-To Play
Now to the basics, we expect you to work against a RESTful API and solve some quests in a 2D game. These quests are rather simple as it would be unfair to exploit too much randomness as your finishing time of each quest will determine your rank in the Leaderboard. The challenge resolves around building algorithms to navigate through the game’s world and interacting with the items there. 

Once the coding will start, you will face 3 phases per level and 1 initial step to begin. The API only works for authenticated users; your first task will be to identify yourself to the API. Once you and the API know each other you can target solving the quests.

You will be challenged by 10 quests in total, whereas each quest uses part of the knowledge needed by the previous one. If you build your code to be reusable and abstract you will be much faster ;), but that’s what everyone is saying and you want to prove me wrong? Well please go ahead. 

As mentioned before, to resolve a level there are 3 phases to pass. First you need to get the levels description. This will be provided with the GET level request. The exact request definitions will follow on the second sheet. After you read the description carefully you will want to implement an algorithm that solves the quest. Once this is done the actual “play” of the level starts. For this you will send a start, multiple different commands and an end request to the API. Once the level is successfully finished you can start the next one. However if you did not finish the level correctly and called end you will be charged with a 1 minute penalty. You may start the same level repeatedly without calling end, so make sure to not stack too many penalties ;).

## API Definition:
The communication will be done over the HTTP Protocol with JSON as data structure of choice. Make sure your HTTP requests look similar if not identical to the ones provided here (except for the placeholders obviously)

### Authentication Request
 - METHOD: POST
 - URL: http://localhost:8888/authenticate
 - HEADER: Content-Type: application/json
 - BODY: { "username": "[user]", "password":"[secretpassword]" }

Example via cURL: 
```sh
curl -H "Content-Type: application/json" -X POST -d '{ "username": "[user]", "password":"[secretpassword]" }' "http://localhost:8888/authenticate”
```

Response:
```json
{ "access_token": "[x-token]" }
```

### Level Description Request
 - METHOD: GET
 - URL: http://localhost:8888/level/[X]
 - HEADER: Content-Type: application/json; x-token: [x-token]

Example via cURL: 
```sh
curl -H "Content-Type: application/json" -H "x-token: [x-token]" -X GET "http://localhost:8888/level/1"
```

The level will start with the index 1 and end with 10, so don’t forget to replace the X.

### Start/End Level Request
 - METHOD: POST
 - URL: http://localhost:8888/level/[X]/[start|end]
 - HEADER: Content-Type: application/json; x-token: [x-token]

Example via cURL:
```sh
curl -H "Content-Type: application/json" -H "x-token: [x-token]" -X POST "http://localhost:8888/level/1/start"
```

### Ingame commands: 
 - METHOD: PUT
 - URL: http://localhost:8888/player/[command]
 - HEADER: Content-Type: application/json; x-token: [your token]

Example via cURL:
```sh
curl -H "Content-Type: application/json" -H "x-token: [TOKEN]" -X PUT "http://localhost:8888/player/right"
```

### Ingame commands as bulk: 
 - METHOD: PUT
 - URL: http://localhost:8888/player/bulk
 - HEADER: Content-Type: application/json; x-token: [your token]
 - BODY: [[command1], [command2], ...] //the first [] is the JSON Array the second level [] are the placeholders

Example via cURL:
```sh
curl -H "Content-Type: application/json" -H "x-token: [TOKEN]" -X PUT -d '{"left", "right", "up", "down"}' "http://localhost:8888/player/bulk"
```

If a single command in the given array is not a valid one, the execution will stop and an error will be returned for you. Commands up to that point are executed though. 
The bulk request will accept 1000 requests at a time and will reject any arrays longer than that.
Possible commands are: left, right, up, down. Interaction with items are automatic if all criteria are met.
