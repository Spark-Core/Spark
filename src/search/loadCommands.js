module.exports = async function(data, location) {
    data.dataStore.commands = new Map();
    var tempcommands = await data.searchInDirectories(location);
    var commands = [];
    tempcommands.forEach(i => {
        try {
            var temp = require(i)
            commands.push({command: temp, location: i})
        } catch (e) {
            console.error(`${i} | Error while loading command: \n ${e}`)
        }

    })

    commands.forEach(i => {
        var {command} = i
        if (command.constructor.name !== "Command") {
            console.warn(`${i.location} | Error while loading command: \n File is not a Command class | See https://discordspark.tk/docs/commands for more info.`)
            i = null;
            return;
        }
        if (command.aliases.length > 0) {
            command.aliases.forEach(i => {
                if (!data.aliases.has(i)) {
                    data.aliases.set(i, command.name.toLowerCase())
                }
            })
        }
        if (typeof command.code != "function") {
            console.warn(`${i.location} | Error while loading command: \n No code specified. | see https://discordspark.tk/docs/commands for more info.`)
            i = null;
            // add return if more checks are added.
        }

    })
    commands = commands.filter(i => {
        return i != null
    })
    commands.forEach(i => {
        if (!data.dataStore.commands.has(i.command.name.toLowerCase())) {
            data.dataStore.commands.set(i.command.name.toLowerCase(), i)
        }
    })
}
