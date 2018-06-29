var Chalk = require("chalk")
module.exports = (client) => {
    function engine() {
        client.dataStore.functions.engines.forEach(i => {
            if (client.config.disabled.has("engines", i.engine.name)) {
                return
            }
            setTimeout(() => {
                if (i.engine.time == 0) {
                    i.engine.code(client)
                } else {
                    i.engine.code(client)
                    setInterval(() => {
                        i.engine.code(client)
                    }, i.engine.time)
                }
            }, i.engine.delay)
        })
    }

    client.dataStore.events.forEach(i => {
        if (client.config.disabled.has("events", i.event.name)) {
            return
        }
        client.on(i.event.event, (one, two, three) => {
            i.event.code(client, one, two, three)
        })
    })


    client.on("guildCreate", guild => {
        guild.customConfig = new client.CustomConfig()
        client.customConfig.set(guild.id, guild.customConfig)
    })
    engine()

    client.on("message", (message) => {
        var p = client.config.prefix
        if (message.channel.type == "text" && client.customConfig.has(message.guild.id) && client.customConfig.get(message.guild.id).prefix) {
            p = client.customConfig.get(message.guild.id).prefix
        }
        if (typeof p == "string") {
            p = [p]
        }
        var prefixMatched = false;
        p.forEach(async (i, n) => {
            if (message.content.startsWith(i)) {
                var command = await isValidCommand(client, message, message.content.split(" ")[0].replace(i, "").toLowerCase())
                if (client.config.disabled.has("commands", command.name)) {
                    return
                }
                if (message.channel.type == "text") {
                    if (client.customConfig.get(message.guild.id).disabled.has("commands", command.name)) {
                        return
                    }
                }
                if (command.value == true) {
                    prefixMatched = true
                    if (await observer(client, message, command.value)) {
                        executeCommand(client, message, command.name)
                    }
                }

            } else if ((n + 1) == p.length && prefixMatched == false) {
                await observer(client, message)
            }
        })
    })
}

async function observer(client, message, command) {
    var results = null;
    var {ignoreBots} = client.config
    if (message.channel.type == "text") {
        if (message.guild.customConfig.ignoreBots) {
            ignoreBots = message.guild.customConfig;
        }
    }
    if (command) {
        if (ignoreBots >= 3 && message.author.bot == true) {
            return
        }
        try {
            results = await client.dataStore.functions.observer.filter(i => {
                    return (i.observer.type == "all" || i.observer.type == "command")
                })
                .filter(i => (client.config.disabled.has("observers", i.observer.name) == false))
            if (message.channel.type == "text") {
                results = results.filter(i => client.customConfig.get(message.guild.id).disabled.has("observers", i.observer.name) == false)
            }
            results = results.map(i => (i.observer.code(client, message)))
        } catch (e) {
            console.log(e)
        }
        try {
            if (results.includes(true)) {
                return false;
            }
            return true;
        } catch (e) {
            console.log(e)
            return false
        }
    } else {
        if (ignoreBots == 2 || ignoreBots == 4) {
            if (message.author.bot == true) {
                return
            }
        }
        try {
            results = await client.dataStore.functions.observer.filter(i => {
                    return (i.observer.type == "all" || i.observer.type == "message")
                })
                .filter(i => (client.config.disabled.has("observers", i.observer.name) == false))
            if (message.channel.type == "text") {
                results = results.filter(i => client.customConfig.get(message.guild.id).disabled.has("observers", i.observer.name) == false)
            }

            results = results.map(i => (i.observer.code(client, message)))
        } catch (e) {
            console.log(e)
        }
    }
}

async function isValidCommand(client, message, commandName) {
    if (client.dataStore.commands.has(commandName)) {
        var {command} = client.dataStore.commands.get(commandName)
        var permissions = client.dataStore.permissions.filter(i => {
                return i.permission.level == command.level
            })
            .filter(i => client.config.disabled.has("permissions", i.permission.name) == false)
        if (message.channel.type == "text") {
            permissions = permissions.filter(i => client.customConfig.get(message.guild.id).disabled.has("permissions", i.permission.name) == false)
        }
        if (permissions.size == 0) {
            return {
                value: false,
                name: commandName
            }
        }
        var results = permissions.map(async i => {
            var {permission} = i
            var result = await permission.code(client, message)
            if (typeof result != "boolean") {
                console.log(Chalk.red("Error | ") + "Permission " + Chalk.yellow(permission.name) + " is not returning the correct value, please read " + Chalk.blue("https://discordspark.com/docs/permissions") + " for more information.")
                return {
                    value: true,
                    name: commandName
                };
            }
            return result;

        })
        results = await Promise.all(results)
        if (results.includes(true)) {
            return {
                value: false,
                name: commandName
            };
        }
        return {
            value: true,
            name: commandName
        };
    }
    if (client.dataStore.aliases.has(commandName)) {
        return isValidCommand(client, message, client.dataStore.aliases.get(commandName))

    }
    return {
        value: false,
        name: commandName
    };


}

function executeCommand(client, message, commandName) {
    var {
        command,
        location
    } = client.dataStore.commands.get(commandName)
    try {
        if (message.channel.type == "dm" && command.dms) {
            command.code(client, message)
        } else if (message.channel.type == "text") {
            command.code(client, message)
        }
    } catch (e) {
        console.error(location + " | An error occured while executing the command.\n" + e)
    }

}
