var Spark = require("../")
const Command = Spark.command("reload")

Command.setLevel(10)

Command.code = async (client, message) => {

  if(!message.content.split(" ")[1]) {
    message.channel.send("Reloading all files...");
    reloadAll();
    await reloadSearch();
    return message.channel.send("Successfully reloaded all files.");
  } else if(message.content.split(" ")[1] === "commands") {
    message.channel.send("Reloading all commands...");
    reloadCommands();
    await reloadSearch();
    return message.channel.send("Successfully reloaded all commands.");
  } else if(message.content.split(" ")[1]  === "observers") {
    message.channel.send("Reloading all observers...");
    reloadObservers();
    await reloadSearch();
    return message.channel.send("Successfully reloaded all observers.");
  } else if(message.content.split(" ")[1] === "engines") {
    message.channel.send("Reloading all enginens...");
    reloadEngines();
    await reloadSearch();
    return message.channel.send("Successfully reloaded engines.");
  } else if(message.content.split(" ")[1] === "snippets") {
    message.channel.send("Reloading all snippets...");
    reloadSnippets();
    await reloadSearch();
    return message.channel.send("Successfully reloaded all snippets.");
  } else if(message.content.split(" ")[1] === "permissions") {
    message.channel.send("Reloading all permission files...");
    reloadPermissions();
    await reloadSearch();
    return message.channel.send("Successfully reloaded all permission files.");
  } else if(message.content.split(" ")[1] === "events") {
    message.channel.send("Reloading all events...");
    reloadEvents();
    await reloadSearch();
    return message.channel.send("Successfully reloaded all events.");
  } else if(message.content.split(" ")[1] != "commands" && message.content.split(" ")[1] != "observers" && message.content.split(" ")[1] != "engines" && message.content.split(" ")[1] != "snippets" && message.content.split(" ")[1] != "permissions" && message.content.split(" ")[1] != "events") {
    return message.channel.send("That is an invalid option! \nPlease choose between `commands`, `observers`, `engines`, `snippets`, `permissions`, or `events`.")
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
        } catch(e) {
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
