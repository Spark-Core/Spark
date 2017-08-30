/* eslint no-console: 0 */
const Discord = require("discord.js");
const request = require("request");
const client = new Discord.Client();
const setup = require("./setup.js");
const fs = require("fs")
var developer = false;
module.exports = {};
module.exports.version = require('./package.json').version;
module.exports.start = function(config) {
    console.log("Loading commands")
    setup(fs, config, require("path").dirname(require.main.filename)).then((commands) => {
        client.commanddata = commands;
        client.config = config;
        start(client, client.config, client.commanddata)
    }).catch((err) => {
        if (developer === false) {
            return console.error("An error occurred while loading commands.", err)
        }
        console.log(err, err.stack)

    })




}




function start(client, config, commanddata) {
    var startedAt = new Date();
    client.login(config.token)
    client.on("disconnect", (x) => {
        if (x.code === 4004) {
            if (startedAt.getTime() + 10000 > new Date().getTime()) {
                return console.error("Discord stated that your bot token was incorrect, please copy the token again in config.json and make sure it's correct.")
            }
        }
    })
    client.on("ready", () => {
        client.fetchApplication().then((application) => {
                if (application.owner === null) {
                    return console.error("Owner check failed, please invite your bot to your server using this url\n https://discordapp.com/oauth2/authorize?client_id=" + client.user.id + "&scope=bot, then try to start the bot again.")
                }
                config.owner_id = application.owner.id

                next()
            })
            .catch(() => {
                return console.error("Bot check failed, This wrapper doesn't support selfbots.")
            })

        function next() {
            console.log(commanddata.commands.size + " commands | " + commanddata.aliases.size + " aliases, bot online")
            console.log("To add new commands, type \"" + config.prefix + "easybot <name>\" to generate a new template!")
			update()
        }
		
		function update() {
		request("https://easy-discord-bot.tk/update?currentversion=0.0.1", 
        function(error, response, body){
            if (error) {console.log("Sorry, There was a issue whilst checking for a update, try again later.")} 
            
            else if (response.statusCode == 200){
                data = JSON.parse(body)
                if (data.update_required){
                    var version;
                    if (require("easy-discord-bot").version.includes("-")){
                        version = data.latest_beta
                    }else{
                        version = data.latest
                    }

                    console.log("An update is required, please type npm install easy-discord-bot \nto install the latest version  (v" + version + ")" )
            } else { return } }


})}
    })
	
	

    client.on("message", (message) => {



        // commands
        if (!message.content.startsWith(config.prefix)) {
            return
        }
        var content = message.content.replace(config.prefix, "")
        var command = content.split(" ")[0].toLowerCase();
        if (commanddata.commands.has(command) === true) {
            doCommand(command, client, message)
        } else if (commanddata.aliases.has(command) === true) {
            doCommand(commanddata.aliases.get(command), client, message);
        }
    })
}


function doCommand(command, client, message) {
    command = client.commanddata.commands.get(command);
    if (command === undefined) {
        return
    }
    try {
        command.command(client, message);
    } catch (err) {
        if (developer) {
            console.warn("Command: " + command.name + " | had an error while executing.", err)
        } else if (err.code == "MODULE_NOT_FOUND") {
            var mod = err.stack.split("\n")[0].replace("Error: Cannot find module ", "")
            console.warn("Command: " + command.name + " | Requires the " + mod + " package to be installed.\nTo install this package, close the script and type: 'npm install " + mod.slice(1, -1) + "'")
            if (message.author.id == client.config.owner_id) {
                message.channel.send("[EDB] Command: **" + command.name + "** | Requires the " + mod + " package to be installed.\nTo install this package, close the script and type: `npm install " + mod.slice(1, -1) + "`")
            }

        } else {
            console.warn("Command: " + command.name + " | had an error. Show the developer of the command module that you are getting this error code: \n" + err)
        }
    }


}