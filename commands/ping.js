command = module.exports = {}
command.name = "ping"
command.command = function(client, message){
    var start = new Date().getTime()
message.channel.send("pinging...").then((message) => {
    var end = new Date().getTime()
    message.edit("Pong! | Took **" + (end - start) + "**ms");
})
}
