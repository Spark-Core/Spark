/* eslint no-process-exit: 0 */
var command = module.exports = {}

command.name = "reboot";
command.aliases = ["restart"];

// Owner only
command.level = 10

command.command = function(client, message) {



    message.channel.send("[EDB] Restarting bot...")
        .then(() => {
            process.exit()
        })
}
