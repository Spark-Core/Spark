const Discord = require('discord.js');
const client = new Discord.Client();
const setup = require("./setup.js");
const fs = require("fs")
var developer = false;
module.exports = {};
module.exports.start = function(config){
console.log("Loading commands")
    setup(fs, config, require('path').dirname(require.main.filename)).then((commands) => {
        client.commanddata = commands;
        client.config = config;
     start(client, client.config, client.commanddata)
 }).catch((err) => {
     if (developer == false){
         console.error("An error occurred while loading commands.", err)
     }else{
         console.log(err, err.stack)
     }
 })





}







function start(client, config, commanddata){
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
console.log(commanddata.commands.size + " commands | "+commanddata.aliases.size+" aliases, bot online")
console.log("To add new commands, type \""+config.prefix+"easybot <name>\" to generate a new template!")
}
})

client.on('message', (message) => {



// commands
if (!message.content.startsWith(config.prefix)){return}
var content = message.content.replace(config.prefix, "")
var command = content.split(" ")[0].toLowerCase();
if (commanddata.commands.has(command) == true){
    doCommand(command, client, message)
}else if (commanddata.aliases.has(command) == true){
    doCommand(commanddata.aliases.get(command), client, message);
}
})
}


function doCommand(command, client, message){
var command = client.commanddata.commands.get(command);
if (command == undefined){return}
try {
    command.command(client, message);
}
catch(err) {
    console.warn(command.name + " | had an error while executing.", err)
}


};
