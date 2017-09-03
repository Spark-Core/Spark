exports.name = "permissioncheck"
exports.type = ["commands"];
exports.function = function(client, message, command) {
    //
    // still needs to be finished.
    // owner: 10
    // normal: 0
    //
    switch (command.level) {
        case 10:
            if (message.author.id === client.config.owner_id) {
                return false;
            }
            return true;


        default:
            return true;
    }



}
