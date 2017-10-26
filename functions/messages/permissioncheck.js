exports.name = "permissioncheck"
exports.type = ["commands"];
exports.function = function(client, message, command) {
    if (!command) {
        return false
    }
    switch (command.level) {
        case 10:
            if (message.author.id === client.config.owner_id) {
                return false;
            }
            return true;
        case 3:

            if (message.channel.type != "text") {
                return true
            }
            if (!client.config.adminRole) {
                client.config.adminRole = "Administrator"
            }
            var adminRole = message.guild.roles.find("name", client.config.adminRole)
            if (adminRole == null) {
                return true
            }
            if (message.member.roles.has(adminRole) == false) {
                return true;
            } else {
                return false
            }
        case 2:
            if (message.channel.type != "text") {
                return true
            }
            if (!client.config.modRole) {
                client.config.modRole = "Moderator"
            }
            var modRole = message.guild.roles.find("name", client.config.modRole)
            if (modRole == null) {
                return true
            }
            if (message.member.roles.has(modRole.id) == false) {
                return true;
            } else {
                return false
            }
        default:
            return false;
    }
}
