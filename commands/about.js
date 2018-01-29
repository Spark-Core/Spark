var Spark = require("../")
const Command = Spark.command("about")
const embed = new Spark.methods.RichEmbed();

Command.addAlias("test-alias")
Command.setLevel(0)

Command.code = (client, message) => {
    if (message.channel.permissionsFor(message.guild.members.get(client.user.id)).serialize().EMBED_LINKS) {
        embed.setTitle("<| title |>")
        embed.setDescription("<| Add some text here about Spark and some stats or something |>")
        return message.channel.send("", {embed})
    }
    message.channel.send("**<| title |>**\n\n<| Add some text here about Spark and some stats or something |>")



}
module.exports = Command;
