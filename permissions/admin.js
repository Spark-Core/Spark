exports.level = 4
exports.filter = (client, message) => {
    if (!message.channel.type != "text") {
        message.channel.send(":x: This command can only be used in a regular text channel.")
        return true
    }
    if (!client.config.adminRole) {
        message.channel.send(":x: You don't have permission to use this command.")
        return true
    }
    if (message.member.roles.has(client.config.adminRole)) {
        return false
    }
    return true
}
