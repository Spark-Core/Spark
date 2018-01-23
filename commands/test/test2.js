var Spark = require("../../")
const Command = Spark.command("test2")

Command.addAlias("test-alias2")

Command.code = (client, message) => {
    message.channel.send(client.version)
}
module.exports = Command;
