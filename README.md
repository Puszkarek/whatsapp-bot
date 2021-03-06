# Whatsapp-Bot

This project require NodeJS.

## First Steps

#### Clone this project

```
    > git clone https://github.com/Puszkarek/whatsapp-bot.git
    > cd whatsapp-bot
```

#### Install depencencies:

    > npm install

#### Run with:

    > npm start

after running it you need to scan the qr

## Api Keys Needed

some functions will need registration in some apis, here is the link to all of them:

-   [Translate ](https://cloud.google.com/apis/docs/getting-started "to use google translate ")
-   [Weather](https://openweathermap.org/appid "open weather api")
-   [Lyrics](https://api.vagalume.com.br/ "vagalume api")
-   [Cat api](https://thecatapi.com/ "cat api")
-   [News](https://gnews.io/ "news api")
-   [Movie](https://www.themoviedb.org/documentation/api "movie database api")
-   [Nasa](https://api.nasa.gov/ "nasa api")

## Features

### Languages

languages are separate from code, so if you want you can add new ones just by creating a new path in lib/language/

###### follow the template inside the folder

#### Current Languages

| Language         | Support |
| ---------------- | ------- |
| Português Brasil | ✔️      |

### Cards Againt Humanity

#### How to Play

Each round, one player asks a question randomly, and the others choose an answer
all commands need to start with {prefix}cah {command}

###### ex: .cah new

##### Group Commands

| Command | Function                  | work |
| ------- | ------------------------- | ---- |
| new     | create a new game session | ✔️   |
| start   | start the game session    | ✔️   |
| kill    | closes the game session   | ✔️   |
| join    | join in game session      | ✔️   |
| leave   | leave the game session    | ❌   |

after start the game, the bot will send your cards in a private chat

##### Bot Chat Commands

| Command       | Function             | work |
| ------------- | -------------------- | ---- |
| (card number) | pick your card       | ✔️   |
| redefine      | reset yout card deck | ✔️   |

## Commands

#### Media

-   Create sticker (with images and gifs)
-   Search Images / Movies / Animes
-   Photo of day - Nasa

#### Utilities

-   search on wikipedia
-   mention all the members
-   translate text

#### Entertainment

-   filter words
-   mesasurer
-   insults
-   choose
-   ship
-   tts

## Thanks to

[wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs "wa-automate-nodejs")
[wikipedia-nodejs](https://github.com/dopecodez/wikipedia "wikipedia-nodejs")
