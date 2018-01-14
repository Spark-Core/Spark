var Spark = require("../")
const Command = Spark.command("test")

Command.addAlias("test-alias")

Command.execute((client, message) => {
    message.channel.send(client.version)
})
