var Chalk = require("chalk")
module.exports = (client) => {

    function bf() {
        client.dataStore.functions.boot.forEach(i => {
            setTimeout(() => {
                if (i.bf.time == 0) {
                    i.bf.code(client)
                } else {
                    i.bf.code(client)
                    setInterval(() => {i.bf.code(client)}, i.bf.time)
                }
            }, i.bf.delay)
        })
    }



    client.on("guildCreate", guild => {
        guild.customConfig = new client.CustomConfig()
        client.customConfig.set(guild.id, guild.customConfig)
    })
    bf()

    client.on("message", (message) => {
        client.config.prefix.forEach(async i => {
            if (message.content.toLowerCase().startsWith(i)) {
                var command = await isValidCommand(client, message, message.content.toLowerCase().split(" ")[0].replace(i, ""))
                if (command.value == true) {
                    if (await mf(client, message, command.value)) {executeCommand(client, message, command.name)}
                } else {
                    await mf(client, message)
                }
            }
            await mf(client, message)
        })

    })




}

async function mf(client, message, command) {
    var results = null;
    var {ignoreBots} = client.config
    if (message.guild.customConfig.ignoreBots) {
        ignoreBots = message.guild.customConfig;
    }
    if (command) {
        if (ignoreBots >= 3) {return}
        try {
            results = await client.dataStore.functions.message.filter(i => {
                return (i.mf.type == "all" || i.mf.type == "commands")
            }).map(i => (i.mf.code(client, message)))
        } catch (e) {
            console.log(e)
        }
        if (results.includes(true)) {
            return false;
        }
        return true;
    }
    if (ignoreBots == 2 || ignoreBots == 4) {return}
    try {
        results = await client.dataStore.functions.message.filter(i => {
            return (i.mf.type == "all" || i.mf.type == "messages")
        }).map(i => (i.mf.code(client, message)))
    } catch (e) {
        console.log(e)
    }

}

async function isValidCommand(client, message, commandName) {
    if (client.dataStore.commands.has(commandName)) {
        var {command} = client.dataStore.commands.get(commandName)
        var permissions = client.dataStore.permissions.filter(i => {
            return i.permission.level == command.level
        })
        if (permissions.size == 0) {return true}
        var results = permissions.map(async i => {
            var {permission} = i
            var result = await permission.code(client, message)
            if (typeof result != "boolean") {
                console.log(Chalk.red("Error | ") + "Permission " + Chalk.yellow(permission.name) + " is not returning the correct value, please read " + Chalk.blue("https://discordspark.tk/docs/permissions") + " for more information.")
                return {value: true, name: commandName};
            }
            return result;

        })
        results = await Promise.all(results)
        if (results.includes(true)) {
            return {value: false, name: commandName};
        }
        return {value: true, name: commandName};
    }
    if (client.dataStore.aliases.has(commandName)) {
        return isValidCommand(client, message, client.dataStore.aliases.get(commandName))

    }
    return {value: false, name: commandName};


}

function executeCommand(client, message, commandName) {
    var {command, location} = client.dataStore.commands.get(commandName)
    try {
        command.code(client, message)
    } catch (e) {
        console.error(location + " | An error occured while executing the command.\n" + e)
    }

}
