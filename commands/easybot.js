var command = module.exports = {}
var path = require("path")
var fs = require("fs")
command.name = "easybot"

command.command = function(client, message) {
    var args = message.content.split(" ");
    if (!message.author.id == client.config.owner_id) {
        return
    }
    if (args[1] == null) {
        return message.channel.send("[EDB] Please specify the name for the command. If you want to use aliases, type them space-seperated behind the name.");

    }

    var data = {
        aliases: [],
        name: args[1]
    }
    if (args[2] != null) {
        args.forEach((i, index) => {
            if (index > 1) {
                data.aliases.push(i)
            }
        })
    }
    fs.access(path.resolve(path.dirname(require.main.filename), "commands/" + data.name + ".js"), fs.constants.R_OK, (err) => {
        if (!err) {
            return message.channel.send("[EDB] This file does already exist. Please try a different name. ")
        }

        fs.writeFile(path.resolve(path.dirname(require.main.filename), "commands/" + data.name + ".js"), "exports.name = \"" + data.name + "\" \nexports.aliases = " + JSON.stringify(data.aliases) + "\nexports.command = function(client, message){\n\n//Write your command functions here.\n\n} ", {options: "utf8"}, (err) => {
            if (err) {
                return message.channel.send("[EDB] Failed to create this file, try to create it manually using this template: ```javascript\nexports.name = \"" + data.name + "\" \nexports.aliases = \"" + JSON.stringify(data.aliases) + "\"\nexports.command = function(client, message){\n\n//Write your command functions here.\n\n} \n```")
            }
            return message.channel.send("[EDB] Created `commands/" + data.name + ".js`, with **" + data.aliases.length + "** aliases.")

        })




    })
}
