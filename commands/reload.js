/* eslint prefer-destructuring: 0 */
var Spark = require("../")
const Command = Spark.command("reload")

Command.setLevel(10)
Command.setDescription("Reload modules in your bot without restarting it.")

Command.code = async (client, message) => {
    var edit = null;
    var arg = message.content.split(" ")[1]
    if (arg) {
        arg = arg.toLowerCase()
    }
    if (!arg || arg == "all") {
        edit = await message.channel.send("Reloading all files...");
        reloadAll();
        await reloadSearch();
        return edit.edit("Successfully reloaded all files.");
    } else if (arg === "commands") {
        edit = await message.channel.send("Reloading all commands...");
        reloadCommands();
        await reloadSearch();
        return edit.edit("Successfully reloaded all commands.");
    } else if (arg === "observers") {
        edit = await message.channel.send("Reloading all observers...");
        reloadObservers();
        await reloadSearch();
        return edit.edit("Successfully reloaded all observers.");
    } else if (arg === "engines") {
        edit = await message.channel.send("Reloading all engines...");
        reloadEngines();
        await reloadSearch();
        return edit.edit("Successfully reloaded engines.");
    } else if (arg === "snippets") {
        edit = await message.channel.send("Reloading all snippets...");
        reloadSnippets();
        await reloadSearch();
        return edit.edit("Successfully reloaded all snippets.");
    } else if (arg === "permissions") {
        edit = await message.channel.send("Reloading all permission files...");
        reloadPermissions();
        await reloadSearch();
        return edit.edit("Successfully reloaded all permission files.");
    } else if (arg === "events") {
        edit = await message.channel.send("Reloading all events...");
        reloadEvents();
        await reloadSearch();
        return edit.edit("Successfully reloaded all events.");
    } else if (![
            "commands",
            "observers",
            "engines",
            "snippets",
            "permissions",
            "events"
        ].includes(arg)) {
        return message.channel.send("Please enter a valid option! \nChoose between `commands`, `observers`, `engines`, `snippets`, `permissions`, or `events`.")
    }

    // Reload Functions

    function reloadAll() {
        reloadCommands()
        reloadObservers()
        reloadEngines();
        reloadSnippets();
        reloadPermissions();
        reloadEvents();
    }

    async function reloadSearch() {
        try {
            var temp = await client.search()
            client.dataStore = temp
        } catch (e) {
            console.error(e);
            message.channel.send("There was an error while reloading.")
        }
    }

    function reloadCommands() {
        client.dataStore.commands.forEach((commands) => {
            delete require.cache[require.resolve(commands.location)];
        })
    }

    function reloadObservers() {
        client.dataStore.functions.observer.forEach((observer) => {
            delete require.cache[require.resolve(observer.location)];
        })
    }

    function reloadEngines() {
        client.dataStore.functions.engines.forEach((engine) => {
            delete require.cache[require.resolve(engine.location)];
        })
    }

    function reloadSnippets() {
        client.dataStore.functions.snippet.forEach((snippet) => {
            delete require.cache[require.resolve(snippet.location)];
        })
    }

    function reloadPermissions() {
        client.dataStore.permissions.forEach((permissions) => {
            delete require.cache[require.resolve(permissions.location)];
        })
    }

    function reloadEvents() {
        client.dataStore.events.forEach((events) => {
            delete require.cache[require.resolve(events.location)];
        })
    }
}
module.exports = Command;
