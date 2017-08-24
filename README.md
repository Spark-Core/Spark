# Easy-Discord-Bot


This is a small project made by [Tobias#5233](https://discordapp.com/) that should make it easy to create a bot. <br />
[Make sure node js 7 or higher is installed!](https://nodejs.org/en/download/)<br />
Commands are modular, so you can just copy it from a few pre-made sources (Source list will come soon.).<br />
You can easily make your own, it's so simple, your coding grandma can do it!

--- 
## Getting started


First open a command prompt in the directory where you want your bot to run in.
Install edb by typing `npm install easy-discord-bot` 

In your project folder you can make a javascript file (app.js for example)
and add the following stuff:

```js
const edb = require("easy-discord-bot")

edb.start({
prefix: "prefix-here",
token: "token-here"
})
```
Replace `prefix-here` with the prefix you want to use for the bot (! / % $ etc.) 

> Prefixes can't have spaces.

Replace `token-here` with the token you got when you made a new application and bot user on [the Discord developer site](https://discordapp.com/developers/applications/me)

>  **Never give out your token to anybody!** If somebody has your token, go to [the Discord developer site](https://discordapp.com/developers/applications/me) and immediately reset your token!!

That's it, you don't need to install discord.js, because that's already taken care of by this package.

### This program is for advanced users
If you want to do some more advanced stuff, please checkout:
- [Komada](http://komada.js.org/)
- [Commando](https://www.npmjs.com/package/discord.js-commando)
