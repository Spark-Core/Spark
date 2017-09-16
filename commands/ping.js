exports.name = "ping"
exports.level = 0;

// Don't use this for regular commands.
exports.system = true
// Don't use this for regular commands.

exports.command = function(client, message) {
    var start = new Date().getTime()
    message.channel.send("Pinging...").then((message) => {
        var end = new Date().getTime()
        message.edit("Pong! | Took **" + (end - start) + "**ms");
    })
}
