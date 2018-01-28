var Chalk = require("chalk")
module.exports = (client) => {

    /*
    client.dataStore.events.forEach((i,n) => {
    client.on(name, (one, two, three, four, five) => {
    i.function(one, two, three, four, five)
    })
    })
    */

    client.on("ready", () => {
        client.dataStore.functions.boot.forEach(i => {
            setTimeout(() => {

                if (i.time == 0) {
                    i.function(client)
                } else {
                    i.function(client)
                    setInterval(() => {i.function(client)}, i.time)
                }
            }, i.delay)
        })
    })
    client.on("message", (message) => {

        client.config.prefix.forEach(async i => {
            if (message.content.toLowerCase().startsWith(i)) {

                if (await isValidCommand(client, message, message.content.toLowerCase().split(" ")[0].replace(i, "")) == true) {
                    //
                    // Check for message functions here!
                    //
                    executeCommand(client, message, message.content.toLowerCase().split(" ")[0].replace(i, ""))
                }
            }
        })

    })




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
                return true;
            }
            return result;

        })
        results = await Promise.all(results)
        if (results.includes(true)) {
            return false;
        }
        return true;
    }
    return false;


}

function executeCommand(client, message, commandName) {
    var {command} = client.dataStore.commands.get(commandName)
    command.code(client, message)

}
