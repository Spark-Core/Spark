/* eslint prefer-destructuring: 0 */
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
            embed.setTitle(cap(command.name) + " command information")
            embed.addField("Name", command.name)
            embed.addField("Level required", command.level)
            embed.addField("Description", command.description)
            command.helpFields.forEach(i => {
                if (embed.fields.length < 25) {
                    embed.addField(i.title, i.desc, i.inline)
                }
            })
            if (data.has(command.name.toLowerCase())) {
                embed.setFooter("You have the permission to use this command.", message.author.avatarURL)
            } else {
                embed.setFooter("You don't have permission to use this command.", message.author.avatarURL)
            }
            embed.setColor(client.config.embedColor || 0xffe13f)
            message.channel.send("", {embed})
        } else {
            var text = `**${command.name} command information**\n\n• **Name:**\n   ${command.name}\n\n• **Level required:**\n   ${command.level}\n\n• **Description:**\n   ${command.description}\n\n`
            command.helpFields.forEach(i => {
                if (text.length < 1950) {
                    text = text + `• **${i.title}:**\n   ${i.desc}\n\n`
                }
            })
            if (data.has(command.name.toLowerCase())) {
                text = text + "\nYou have the permission to use this command."
            } else {
                text = text + "\nYou don't have the permission to use this command."
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
            var oldData = data;
            data = Array.from(data)
            var n = 0
            if (!isNaN(message.content.split(" ")[1])) {
                if (parseInt(message.content.split(" ")[1]) >= 0 || (parseInt(message.content.split(" ")[1]) - 1) * 25 < data.length) {
                    n = (parseInt(message.content.split(" ")[1]) - 1) * 25;
                }
            }
            data = data.splice(n, 25)
            data.forEach((entry) => {
                var {command} = entry[1];

                return embed.addField("• " + command.name, command.description, false)
            })
            embed.setColor(client.config.embedColor || 0xffe13f)
            var footer = "You can use " + oldData.size + " commands."
            if (oldData.size > 25) {
                footer = footer + " - do help < number > to see the next page"
            }
            embed.setFooter(footer)


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

function cap(string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}
module.exports = Command;
