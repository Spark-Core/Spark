exports.name = "permissioncheck"
exports.type = ["commands"];
exports.function = function(client, message, command) {
    if (!command){return false}
    switch (command.level) {
        case 10:
            if (message.author.id === client.config.owner_id) {
                return false;
            }
            return true;
        default:
            return false;
    }
}
