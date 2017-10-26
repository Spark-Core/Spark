/* eslint no-console: 0 */
exports.name = "system-message-handler"
exports.event = "message"
exports.function = (client, message) => {
    if (!message.content.startsWith(client.config.prefix)) {
        client.data.util.handleMessages.dofuncs(client, message, "message").catch((data) => {
            if (data) {
                if (client.developer) {
                    return console.warn(data)
                }
            }
        })
        return
    }
    var content = message.content.replace(client.config.prefix, "")
    var command = content.split(" ")[0].toLowerCase();
    if (client.commanddata.commands.has(command) === true) {
        message.command = client.commanddata.commands.get(command)
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
