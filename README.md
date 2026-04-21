# jeopardy-study
A web app that shows clues from any Jeopardy! game for easy study. Data source: J-Archive


# How to use
https://nodejs.org/en/download/current

`docker run -it --rm --entrypoint bash -p 8080:80 node:25-slim`

Use `-v` option to map development directory into your docker container
Then, once in the docker container, go to that directory (should have all this repo's files in it).

The node server will run on port 80 in the docker container and docker will forward all traffic on port 8080 to port 80 of your container.

`node server.js`

go to `localhost:8080/game/9418` (or replace '9418' with any other game number) in your browser

example: https://j-archive.com/showgame.php?game_id=9418