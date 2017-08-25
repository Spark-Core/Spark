/* eslint no-process-exit: 0 */
var command = module.exports = {}

command.name = "reboot";
command.aliases = ["restart"];

command.command = function(client, message) {
    // needs to be replaced with command requirements when started working on!
    if (client.config.owner_id !== message.author.id) {return}


    message.channel.send("[EDB] Restarting bot...")
        .then(() => {
            process.exit()
        })
}
