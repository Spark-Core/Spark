/* eslint no-console: 0 */
exports.name = "reload";
// owner only
exports.level = 10;

// Don't use this for regular commands.
exports.system = true
// Don't use this for regular commands.

const setup = require("../setup.js");
exports.command = function(client, message) {


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
                var system = 0;
                var regular = 0;
                commands.commands.commands.forEach((i) => {
                    if (i.system) {
                        system = system + 1
                    } else {
                        regular = regular + 1
                    }
                })
                if (commands.issues > 1) {
                    return m.edit("[EDB] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")\n**" + commands.issues + "** commands failed to load. See the console for more info.")
                } else if (commands.issues == 1) {
                    return m.edit("[EDB] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")\n**" + commands.issues + "** command failed to load. See the console for more info.")
                }
                m.edit("[EDB] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")")
            }).catch((err) => {
                m.edit(err.stack.toLowerCase())
                if (client.developer) {
                    console.log("error while reloading: \n", err.stack)
                }
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
                if ((data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) > 1) {
                    return m.edit("[EDB] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) + "** issues while loading. See the console for more info.")
                } else if ((data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) === 1) {
                    return m.edit("[EDB] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) + "** issue while loading. See the console for more info.")
                }
                m.edit("[EDB] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.")
            }).catch((err) => {
                m.edit(err.stack.toLowerCase())
            })
        })

}
