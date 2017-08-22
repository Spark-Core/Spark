const Discord = require('discord.js');
const client = new Discord.Client();
const setup = require("./setup.js");
const fs = require("fs")

modules.exports = {};
modules.exports.start = function(config){

    setup(fs, config).then((commands) => {
     start(client, config, commands)
    })





}







function start(client, config, commands){
var startedAt = new Date();
client.login(config.token)
client.on('disconnect', (x) => {
if (x.code == 4004){
    if (startedAt.getTime() + 10000>  new Date().getTime()){
        return console.error("Discord stated that your bot token was incorrect, please copy the token again in config.json and make sure it's correct.")
    }
}
})
client.on('ready', () => {
client.fetchApplication().then((application) => {
if (application.owner == null){console.error("Owner check failed, please invite your bot to your server using this url\n https://discordapp.com/oauth2/authorize?client_id="+client.user.id+"&scope=bot, then try to start the bot again.")}
else{config.owner_id = application.owner.id}
next()
})
.catch(() => {console.error("Bot check failed, This wrapper doesn't support selfbots.")})
function next(){
console.log("Loaded "+commands.length+" commands, bot online")
console.log("To add new commands, type \""+config.prefix+"easybot <name>\" to generate a new template!")
}
})

}
