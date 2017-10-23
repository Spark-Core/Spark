var path = require("path")
var fs = require("fs")
exports.name = "createcommand"
// Owner only
exports.level = 10;
exports.system = true;
exports.command = function(client, message) {
    var args = message.content.split(" ");

    if (args[1] == null) {
        return message.channel.send("[Spark] Please specify the name for the command. If you want to use aliases, type them space-seperated behind the name.");

    }

    var data = {
        aliases: [],
        name: args[1]
    }
    if (args[1].match(/[/\\<>:*|]/g)) {
        return message.channel.send("[Spark] Filenames can't include one of these characters:  ` / \\ < > : * | `, please try a different filename.")
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
            return message.channel.send("[Spark] This file does already exist. Please try a different name. ")
        }

        fs.writeFile(path.resolve(path.dirname(require.main.filename), "commands/" + data.name + ".js"), "exports.name = \"" + data.name + "\" \nexports.aliases = " + JSON.stringify(data.aliases) + "\nexports.command = function(client, message){\n\n//Write your command functions here.\n\n} ", {options: "utf8"}, (err) => {
            if (err) {
                return message.channel.send("[Spark] Failed to create this file, try to create it manually using this template: ```javascript\nexports.name = \"" + data.name + "\" \nexports.aliases = \"" + JSON.stringify(data.aliases) + "\"\nexports.command = function(client, message){\n\n//Write your command functions here.\n\n} \n```")
            }
            return message.channel.send("[Spark] Created `commands/" + data.name + ".js`, with **" + data.aliases.length + "** aliases. \nPut some code into this file to make it do something.")

        })




    })
}
