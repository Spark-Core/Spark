/* eslint no-console: 0 */
const Discord = require("discord.js");

const client = new Discord.Client();
const setup = require("./setup.js");
const fs = require("fs")
var util = require("./src/util.js")
var developer = false;
module.exports = {};
module.exports.version = require("./package.json").version;
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
        if (client.user.bot == false) {
            return console.warn("This wrapper doesn't support selfbots.")
        }

        console.log(commanddata.commands.size + " commands | " + commanddata.aliases.size + " aliases, bot online")
        console.log("To add new commands, type \"" + config.prefix + "easybot <name>\" to generate a new template!")
        util.checkUpdate(module.exports).then(update => {
            console.log(update)
        }).catch(err => {
            console.warn(err)
        })




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
