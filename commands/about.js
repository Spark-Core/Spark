var Spark = require("../")
const Command = Spark.command("about")

Command.setLevel(0)
Command.setDescription("Get information about this bot.")

Command.code = async (client, message) => {

    var v = process.memoryUsage().heapUsed
    v = (v / 1024 / 1024).toFixed(3);

    var prefixText = prefixList().map(i => i).join(", ")
    if (prefixList().length > 1) {
        prefixText = prefixList().map(i => ("`" + i + "`")).join(", ")
    }
    if (message.channel.permissionsFor(message.guild.members.get(client.user.id)).serialize().EMBED_LINKS) {
        const embed = new Spark.methods.RichEmbed();
        embed.setTitle(`Information about ${client.user.username}`)
        embed.setDescription(`Hello, I am ${client.user.tag}. I am owned and maintained by <@${client.config.ownerID}>, created with the Discord.JS framework known as **Spark**.\n\n` +
            "Spark is a powerful modular framework that makes creating Discord bots easy.")
        embed.addField("Prefix(es):", prefixText, true)
        embed.addField("Servers:", client.guilds.size, true)
        embed.addField("Users:", client.users.size, true)
        embed.addField("Memory Usage:", `${v} MB`, false)
        embed.addField("Spark Version:", Spark.version, false)
        embed.addField("More Information:", "Feel free to visit our [website](https://discordspark.com) or our discord [server](https://discord.gg/TezD2Zg) for more information about the Spark Framework.", false)
        embed.setFooter("Made with Spark")
        embed.setTimestamp()
        embed.setColor(0xe1e818)
        return message.channel.send("", {embed})
    }
    var owner = await client.fetchUser(client.config.ownerID);
    message.channel.send(`Hello, I am ${client.user.tag}. I am owned and maintained by ${owner.tag}, created with the Discord.JS framework known as **Spark**.\n\n` +
        "Spark is a powerful modular framework that makes creating Discord bots easy.\n\n" +
        `My prefix(es) are: ${prefixText}.\n` +
        // "My ping is: {bot_latency}ms.\n"+
        `I am running on version \`${Spark.version}\` of spark.\n\n` +
        "__Statistics__\n" +
        `I am currently in \`${client.guilds.size}\` servers.\n` +
        `I am being used by \`${client.users.size}\` users.\n` +
        `I am using \`${v}\` MB of memory.\n\n` +
        "For more information about the **Spark** framework visit https://discord.gg/TezD2Zg or the website https://discordspark.com")

    function prefixList() {
        if (client.customConfig.get(message.guild.id).prefix) {
            return client.customConfig.get(message.guild.id).prefix
        }
        return client.config.prefix
    }

}
module.exports = Command;
