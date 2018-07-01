var Spark = require("../../")
const request = require("request-promise")
const chalk = require("chalk")
const Engine = Spark.engine("checkUpdate")
Engine.setTime(43200000)
Engine.code = async (client) => {
    try {
        var versions = await request({
            method: "GET",
            uri: "https://api.discordspark.com/versions",
            qs: {
                version: Spark.version,
                ownerID: client.config.ownerID
            },
            json: true
        })
        var version = versions.stable;
        var discordStatus = versions.discord;
        var command = "npm install sparkbots"
        if (client.version.includes("beta")) {
            version = versions.beta
            command = "npm install sparkbots@beta"
        }
        var data = {
            version,
            command
        }
        if (version.version !== Spark.version) {
            if (client.config.ignoreUpdate) {
                if (client.config.ignoreUpdate instanceof Array && client.config.ignoreUpdate.includes(version.version) == true) {
                    return
                }
                if (client.config.ignoreUpdate == true) {
                    return
                }
            }
            checkOwner(client, data)

            if (discordStatus) {
                console.log(`${chalk.yellow("Spark")} update ${chalk.yellow(version.version)} has been released!\n\nTo update, type the following command: ${chalk.blue(command)}\nIn your bot's directory.\n\nTo read about what has been changed go to https://discordspark.com/releases \n\nWant to ignore this message?\nAdd ${chalk.red(`ignoreUpdate: ["${version.version}"]`)} to your start file.`)
                checkOwner(client, data)
            } else {
                console.log("You're running this bot on an unreleased version. (" + chalk.red(Spark.version) + ") compatibility and support may not be up to date with what you expect.\nIf you don't know what this means please stop the bot, and type: " + chalk.blue("npm install sparkbots") + " To get back to a stable release.")

            }
        }
    } catch (e) {
        // letting silently error unless updateErrors: true in config.
        if (client.config.updateErrors) {
            console.error("Error while fetching for update:")
            console.error(e)
        }
    }
}

async function checkOwner(client, data) {
    if ((new Date(data.version.release_date).getTime() + 999943200000) > new Date().getTime()) {
        client.config.updateErrors = true
        try {
            var owner = await client.fetchUser(client.config.ownerID);
            var channel = await owner.createDM()
            var messages = await channel.fetchMessages({limit: 10})
            messages = messages.filter(i => {
                return i.content.includes(`["${data.version.version}"]`)
            })
            if (messages.size == 0) {
                owner.send(`Spark update **${data.version.version}** has been released!\n\nTo update, type the following command: **${data.command}**\nIn your bot's directory.\n\nTo read about what has been changed go to https://discordspark.com/releases \n\nWant to ignore this message?\nAdd this to your start file: \`\`\`json\nignoreUpdate: ["${data.version.version}"]\n\`\`\``)
            } else if (client.config.updateErrors) {
                console.warn("No update dm sent, as there was (1+) sent in the channel (last 10)")
            }

        } catch (e) {
            if (client.config.updateErrors) {
                console.error("Error while dming owner for update:")
                console.error(e)
            }
        }
    }
}
Engine.export(module)
