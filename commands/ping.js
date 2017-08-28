var command = module.exports = {}

command.name = "ping"

command.command = function(client, message) {
    var start = new Date().getTime()
    message.channel.send("Pinging...").then((message) => {
        var end = new Date().getTime()
        message.edit("Pong! | Took **" + (end - start) + "**ms");
    })
}
