/* eslint no-process-exit: 0 */


exports.name = "reboot";
exports.aliases = ["restart"];
exports.ignoredChannels = [];
// Don't use this for regular commands.
exports.system = true
// Don't use this for regular commands.


// Owner only
exports.level = 10

exports.command = function(client, message) {



    message.channel.send("[Spark] Restarting bot...")
        .then(() => {
            process.exit()
        })
}
