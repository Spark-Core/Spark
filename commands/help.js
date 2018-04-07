var Spark = require("../")
const Command = Spark.command("help")

Command.setLevel(0)
Command.allowDms(false)
Command.setDescription("Get information about the bot commands.")

Command.code = async (client, message) => {
    const embed = new Spark.methods.RichEmbed();
    if (!message.content.split(" ")[1]) {
        sendCommands()
    } else if (client.dataStore.commands.has(message.content.split(" ")[1].toLowerCase())) {
        var {command} = client.dataStore.commands.get(message.content.split(" ")[1].toLowerCase())
        var data = await getData()
        if (message.channel.permissionsFor(message.guild.members.get(client.user.id)).serialize().EMBED_LINKS) {
            embed.setTitle(command.name + " command information")
            embed.addField("Name", command.name)
            embed.addField("Level required", command.level)
            embed.addField("Description", command.description)
            if (data.has(command.name.toLowerCase())) {
                embed.setFooter("You have the permission to use this command.", message.author.avatarURL)
            } else {
                embed.setFooter("You don't have permission to use this command.", message.author.avatarURL)
            }
            embed.setColor(client.config.embedColor || 0xffe13f)
            message.channel.send("", {embed})
        } else {
            var text = `**${command.name} command information**\n\n• **Name:**\n   ${command.name}\n\n• **Level required:**\n   ${command.level}\n\n• **Description:**\n   ${command.description}\n\n\n`
            if (data.has(command.name.toLowerCase())) {
                text = text + "You have the permission to use this command."
            } else {
                text = text + "You don't have the permission to use this command."
            }
            message.channel.send(text)
        }
    } else {
        sendCommands()
    }

    async function sendCommands() {
        var data = await getData();
        if (message.channel.permissionsFor(message.guild.members.get(client.user.id)).serialize().EMBED_LINKS) {
            embed.setTitle(`${client.user.username} help information`)
            embed.setDescription(`Type ${client.config.prefix[0]}help command-name to get more information.`)
            data.forEach((entry) => {
                var {command} = entry;
                return embed.addField("• " + command.name, command.description, false)
            })
            embed.setColor(client.config.embedColor || 0xffe13f)
            embed.setFooter(data.commands.size + " commands loading")
            return message.channel.send("", {embed});
        }
        var text = `**${client.user.username} help information**\nType \`${client.config.prefix[0]}help command-name\` to get more information.\n\n`
        data.forEach(entry => {
            var {command} = entry;
            text = text + "• **" + command.name + "**\n     " + command.description + "\n"
        })
        embed.setFooter(data.count + " Commands for you")
        return message.channel.send(text)
    }
    async function getData() {
        var levels = []
        client.dataStore.commands.forEach(i => {
            var {command} = i
            if (!levels.includes(command.level)) {
                levels.push(command.level)
            }
        })
        levels = client.dataStore.permissions.filter(i => {
            return levels.includes(i.permission.level)
        }).map(async i => {
            var result = await i.permission.code(client, message)
            return {
                level: i.permission.level,
                result
            };
        })
        var result = await Promise.all(levels)
        levels = new Map()
        result.forEach(i => {
            levels.set(i.level, i.result)
        })
        return client.dataStore.commands.filter(i => {
            return levels.get(i.command.level) == false
        })
    }


}
module.exports = Command;
