/* eslint no-console: 0 */
/* eslint prefer-destructuring: 0*/
exports.name = "system-message-handler"
exports.event = "message"
exports.function = (client, message) => {
    if (message.system == true) {
        return
    }

    var prefix = client.config.prefix
    var id = message.channel.id;
    if (message.guild){
        id = message.guild.id;
    }

    if (client.customConfig.has(id)) {
        if (client.customConfig.get(id).prefix != null) {
            prefix = client.customConfig.get(id).prefix
        }
    }
    if (!message.content.startsWith(prefix)) {
        if (message.author.bot){
            if (client.config.allowBots == "message" || client.config.allowBots == true) {return}
        }
        client.data.util.handleMessages.dofuncs(client, message, "message").catch((data) => {
            if (data) {
                if (client.developer) {
                    return console.warn(data)
                }
            }
        })
        return
    }
    if (message.author.bot){
        if (client.config.allowBots == "command" || client.config.allowBots == true) {return}
    }
    var content = message.content.replace(prefix, "")
    var command = content.split(" ")[0].toLowerCase();
    if (client.commanddata.commands.has(command) === true) {
        message.command = client.commanddata.commands.get(command)
        if (message.channel.ignoredChannels.includes(message.channel.type)){return}

        client.data.util.handleMessages.dofuncs(client, message, "command").then(() => {
            client.data.util.handleMessages.doCommand(command, client, message)
        }).catch(data => {
            if (data) {
                if (client.developer) {
                    return console.warn(data)
                }
            }
        })
    } else if (client.commanddata.aliases.has(command) === true) {
        message.command = client.commanddata.commands.get(client.commanddata.aliases.get(command))
        client.data.util.handleMessages.dofuncs(client, message, "command").then(() => {
            client.data.util.handleMessages.doCommand(client.commanddata.aliases.get(command), client, message);
        }).catch(data => {
            if (data) {
                console.log(data)
            }
        })
    }
}
