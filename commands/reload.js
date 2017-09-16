var command = module.exports = {}

command.name = "reload";
// owner only
command.level = 10;

const setup = require("../setup.js");
command.command = function(client, message) {


    var args = message.content.split(" ")
    if (args[1] == null) {
        args[1] = ""
    }
    switch (args[1].toLowerCase()) {
        case "commands":
            reloadcommands(client, client.config, message)
            break;
        case "functions":
            reloadfunctions(client, message)
            break;
        default:
            message.channel.send("You forgot to specify what to reload, choose from: `commands` `functions`")
    }
}

function reloadcommands(client, config, message) {

    message.channel.send("[EDB] reloading commands")
        .then(m => {
            setup(config, require("path").dirname(require.main.filename), true).then((commands) => {
                client.commanddata = commands.commands;
                client.config = config;
                if (commands.issues > 1) {
                    return m.edit("[EDB] Reloaded **" + client.commanddata.commands.size + "** commands succesfully.\n**" + commands.issues + "** commands failed to load. See the console for more info.")
                } else if (commands.issues == 1) {
                    return m.edit("[EDB] Reloaded **" + client.commanddata.commands.size + "** commands succesfully.\n**" + commands.issues + "** command failed to load. See the console for more info.")
                }
                m.edit("[EDB] Reloaded **" + client.commanddata.commands.size + "** commands succesfully.")

            }).catch((err) => {
                m.edit(err.stack.toLowerCase())
            })
        })

}

function reloadfunctions(client, message) {

    message.channel.send("[EDB] reloading functions")
        .then(m => {
            var temp = client.config;
            setup(temp, require("path").dirname(require.main.filename), true).then((data) => {
                client.functions = data.functions
                client.config = temp;
                if ((data.functions.messages.issues + data.functions.boot.issues) > 1) {
                    return m.edit("[EDB] Reloaded **" + client.functions.messages.messagefuncs.size + "** messagefunctions and **" + client.functions.boot.bootfuncs.size + "** bootfunctions succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues) + "** issues while loading. See the console for more info.")
                } else if ((data.functions.messages.issues + data.functions.boot.issues) === 1) {
                    return m.edit("[EDB] Reloaded **" + client.functions.messages.messagefuncs.size + "** messagefunctions and **" + client.functions.boot.bootfuncs.size + "** bootfunctions succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues) + "** issue while loading. See the console for more info.")
                }
                m.edit("[EDB] Reloaded **" + client.functions.messages.messagefuncs.size + "** messagefunctions and **" + client.functions.boot.bootfuncs.size + "** bootfunctions succesfully.")
            }).catch((err) => {
                m.edit(err.stack.toLowerCase())
            })
        })

}
