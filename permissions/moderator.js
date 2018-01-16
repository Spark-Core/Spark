exports.level = 3
exports.filter = (client, message) => {
    if (!message.channel.type != "text") {
        message.channel.send(":x: This command can only be used in a regular text channel.")
        return true
    }
    if (!client.config.modRole) {
        message.channel.send(":x: You don't have permission to use this command.")
        return true
    }
    if (message.member.roles.has(client.config.modRole)) {
        return false
    }
    return true
}
