/* eslint no-console: 0 */
/* eslint max-params: 0 */
/* eslint func-style: 0 */
const Discord = require("discord.js");
const client = new Discord.Client();
const setup = require("./setup.js");
var util = require("./src/util.js")
client.developer = false;
module.exports = {};
module.exports.version = require("./package.json").version;
module.exports.start = function(config) {
    if (config.developer) {
        client.developer = config.developer
    }
    if (config.allowBots == null) {
        config.allowBots = false
    }
    console.log("Booting Spark")
    setup(config, require("path").dirname(require.main.filename)).then((data) => {
        client.commanddata = data.commands;
        client.events = data.events;
        client.functions = data.functions
        client.functions.types = {
            messages: [],
            commands: []
        }
        client.customConfig = new Map()
        client.addCustom = client.addCustomConfig = (serverid, data) => {
            if (!serverid || typeof serverid != "string" || isNaN(serverid)) {
                return console.warn("Invalid first argument, expecting a snowflake.")
            }
            if (data || typeof data == 'object') {
                client.customconfig.set(serverid, data)
            } else if (typeof data != "object") {
                return console.warn("Invalid second argument, expecting an object.")
            } else {
                client.customconfig.delete(serverid)
            }
        }
        client.commanddata = new Map()
        client.data = {};
        client.data.version = module.exports.version;
        client.data.util = util
        client.snippets = data.functions.snippets.snippets
        client.functions.messages.messagefuncs.forEach(i => {
            i.type = i.type.map(i => (i.toLowerCase()))
            if (i.type == "all" && i.type.length === 1) {
                client.functions.types.commands.push(i.name);
                client.functions.types.messages.push(i.name);
            } else if (i.type == "messages") {
                client.functions.types.messages.push(i.name);
            } else if (i.type == "commands") {
                client.functions.types.commands.push(i.name);
            }
        })
        client.config = config;
        start(client, client.config, client.commanddata)
    }).catch((err) => {
        if (client.developer === false) {
            return console.error("An error occurred while loading commands.", err)
        }
        console.log(err, err.stack)
    })
}

function start(client, config, commanddata) {
    var startedAt = new Date();
    client.login(config.token)
    client.on("disconnect", (x) => {
        if (x.code === 4004) {
            if (startedAt.getTime() + 10000 > new Date().getTime()) {
                return console.error("Discord stated that your bot token was incorrect, please copy the token again in config.json and make sure it's correct.")
            }
        }
    })
    client.on("ready", () => {
        if (client.user.bot == false) {
            return console.warn("This wrapper doesn't support selfbots.")
        }
        client.fetchApplication().then((application) => {
            if (application.owner == null) {
                if (client.config.owner_id == null) {
                    return console.error("Can't fetch the owner's id, please follow instructions here <page_link>.")
                } else if (client.users.get(client.config.owner_id) == undefined) {
                    return console.error("The bot can't find the owner_id set up inside your file, \nThis could be because it's not valid, or because you are not in a server with it, please invite it to a server where you are on.")
                }
            } else {
                client.config.owner_id = application.owner.id
            }
        }).catch((err) => {
            if (client.developer) {
                console.warn("Can't fetch application, error: \n", err)
            } else if (client.config.owner_id == null) {
                return console.error("Can't fetch the owner's id, please follow instructions here <page_link>.")
            } else if (client.users.get(client.config.owner_id) == undefined) {
                return console.error("The bot can't find the owner_id set up inside your file, \nThis could be because it's not valid, or because you are not in a server with it, please invite it to a server where you are on.")
            }
        })
        client.functions.boot.bootfuncs.forEach((data) => {
            function returnfunction() {
                return data.function(client)
            }
            setTimeout(function() {
                if (data.time > 0) {
                    setInterval(returnfunction, data.time)
                }
                return returnfunction()
            }, data.delay);
        })
        console.log(commanddata.commands.size + " commands | " + commanddata.aliases.size + " aliases, bot online")
        if (client.config.firstTime) {
            console.log(`Welcome to Spark! You are running Spark version ${client.data.version}\n\nTo add new commands, type "${config.prefix}createcommand <name> <alias1> <alias2> <alias3>" to generate a new template!`)
        }
        client.events.events.forEach(i => {
            client.on(i.event, (one, two, three, four, five) => {
                try {
                    i.function(client, one, two, three, four, five)
                } catch (e) {
                    console.warn("An error occurred in the event \"" + i.event + "\"")
                    if (client.developer) {
                        console.warn(e)
                    }
                }
            })
        })
        client.events.events.forEach(i => {
            if (i.event === "ready") {
                i.function(client)
            }
        })
    })
}
