var Spark = require("../")
const Command = Spark.command("test")

Command.addAlias("test-alias")
Command.setLevel(7)

Command.code = (client, message) => {
    message.channel.send(client.version)
}
module.exports = Command;
