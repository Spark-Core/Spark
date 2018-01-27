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

        client.config.prefix.forEach(i => {
            if (message.content.toLowerCase().startsWith(i)) {
                if (isValidCommand(client, message.content.toLowerCase().split(" ")[0].replace(i, ""))) {
                    executeCommand(client, message)
                }
            }
        })

    })




}

function isValidCommand(client, commandName) {
    if (client.dataStore.commands.has(commandName)) {
        var {command} = client.dataStore.commands.get(commandName)
        console.log(command.level)
    } else {
        return false;
    }

}

function executeCommand(client, message) {

    message.channel.send("")

}
