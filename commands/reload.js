var command = module.exports = {}

command.name = "reload";
// owner only
command.level = 10;

const setup = require("../setup.js");
const fs = require("fs")
command.command = function(client, message) {


    var args = message.content.split(" ")
    if (args[1] == null) {
        args[1] = ""
    }
    switch (args[1].toLowerCase()) {
        case "commands":
            reloadcommands(client, client.config, message)
            break;
        default:
            message.channel.send("You forgot to specify what to reload, choose from: `commands`")
    }
}

function reloadcommands(client, config, message) {

    message.channel.send("[EDB] reloading commands")
        .then(m => {
            setup(fs, config, require("path").dirname(require.main.filename), true).then((commands) => {
                client.commanddata = commands;
                client.config = config;
                if (commands.issues > 1) {
                    return m.edit("[EDB] Reloaded **" + client.commanddata.commands.size + "** commands succesfully.\n**" + commands.issues + "** commands failed to load. See the console for more info.")
                } else if (commands.issues == 1) {
                    return m.edit("[EDB] Reloaded **" + client.commanddata.commands.size + "** commands succesfully.\n**" + commands.issues + "** command failed to load. See the console for more info.")
                }
                m.edit("[EDB] Reloaded **" + client.commanddata.commands.size + "** commands succesfully.")

            }).catch((err) => {
                err.stack.toLowerCase()
            })
        })

}
