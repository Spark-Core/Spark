/* eslint no-console: 0 */
const Discord = require("discord.js");

const client = new Discord.Client();
const setup = require("./setup.js");
var util = require("./src/util.js")
var developer = false;
module.exports = {};
module.exports.version = require("./package.json").version;
module.exports.start = function(config) {
    console.log("Loading commands")
    setup(config, require("path").dirname(require.main.filename)).then((data) => {
        client.commanddata = data.commands;
        client.functions = data.functions
        client.functions.types = {
            messages: [],
            commands: []
        }

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
        if (developer === false) {
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
            if (developer) {
                console.warn("Can't fetch application, error: \n", err)
            } else if (client.config.owner_id == null) {
                return console.error("Can't fetch the owner's id, please follow instructions here <page_link>.")
            } else if (client.users.get(client.config.owner_id) == undefined) {
                return console.error("The bot can't find the owner_id set up inside your file, \nThis could be because it's not valid, or because you are not in a server with it, please invite it to a server where you are on.")
            }
        })

        console.log(commanddata.commands.size + " commands | " + commanddata.aliases.size + " aliases, bot online")
        console.log("To add new commands, type \"" + config.prefix + "createcommand <name> <alias1> <alias2> <alias3>\" to generate a new template!")
        util.checkUpdate(module.exports).then(update => {
            console.log(update)
        }).catch(err => {
            console.warn(err)
        })




    })



    client.on("message", (message) => {




        // commands
        if (!message.content.startsWith(config.prefix)) {
            dofuncs(client, message, "message").then(data => {
                console.log(data)
            }).catch((data) => {
                if (data) {
                    console.log(data)
                }
            })
            return
        }
        var content = message.content.replace(config.prefix, "")
        var command = content.split(" ")[0].toLowerCase();
        if (commanddata.commands.has(command) === true) {
            message.command = commanddata.commands.get(command)
            dofuncs(client, message, "command").then(() => {
                doCommand(command, client, message)
            }).catch(data => {
                if (data) {
                    console.log(data)
                }
            })
        } else if (commanddata.aliases.has(command) === true) {
            message.command = commanddata.commands.get(commanddata.aliases.get(command))
            dofuncs(client, message, "command").then(() => {
                doCommand(commanddata.aliases.get(command), client, message);
            }).catch(data => {
                if (data) {
                    console.log(data)
                }
            })
        }
    })
}


function doCommand(command, client, message) {
    command = client.commanddata.commands.get(command);
    if (command === undefined) {
        return
    }
    try {
        command.command(client, message);
    } catch (err) {
        if (developer) {
            console.warn("Command: " + command.name + " | had an error while executing.", err)
        } else if (err.code == "MODULE_NOT_FOUND") {
            var mod = err.stack.split("\n")[0].replace("Error: Cannot find module ", "")
            console.warn("Command: " + command.name + " | Requires the " + mod + " package to be installed.\nTo install this package, close the script and type: 'npm install " + mod.slice(1, -1) + "'")
            if (message.author.id == client.config.owner_id) {
                message.channel.send("[EDB] Command: **" + command.name + "** | Requires the " + mod + " package to be installed.\nTo install this package, close the script and type: `npm install " + mod.slice(1, -1) + "`")
            }

        } else {
            console.warn("Command: " + command.name + " | had an error. Show the developer of the command module that you are getting this error code: \n" + err)
        }
    }
}

function dofuncs(client, message, type) {
    return new Promise(function(resolve, reject) {
        if (type == "message") {
            var funcnumber = 0;
            if (client.functions.types.messages.length == 0) {
                return resolve()
            }
            client.functions.messages.messagefuncs.forEach(i => {
                var num = client.functions.messages.messagefuncs.size
                if (client.functions.types.messages.includes(i.name) == false) {
                    done(funcnumber, num)
                }
                var result = i.function(client, message, message.command)
                if (result == undefined) {
                    return done(funcnumber, num)
                }
                if (typeof result.then == "function") {
                    result.then(data => {
                        if (data) {
                            if (typeof data == "string") {
                                message.channel.send(data)
                            }
                            return reject()
                        }
                        done(funcnumber, num)
                    }).catch(err => console.warn(i.name + " | Message function just stopped working correctly. | Error: \n", err))
                } else {
                    if (result) {
                        if (typeof result == "string") {
                            message.channel.send(result)
                        }
                        return reject()
                    }
                    done(funcnumber, num)
                }
            })


        }
        if (type == "command") {
            var number = 0;
            if (client.functions.types.commands.length == 0) {
                return resolve()
            }
            client.functions.messages.messagefuncs.forEach(i => {
                var num = client.functions.messages.messagefuncs.size
                if (client.functions.types.commands.includes(i.name) == false) {
                    done(number, num)
                }

                var result = i.function(client, message, message.command)
                if (result == undefined) {
                    return done(number, num)
                }
                if (typeof result.then == "function") {
                    result.then((data) => {
                        if (data) {
                            if (typeof data == "string") {
                                message.channel.send(data)
                            }
                            return reject()
                        }
                        done(number, num)
                    }).catch(err => console.warn(i.name + " | Message function just stopped working correctly. | Error: \n", err))
                } else {
                    done(number, num)
                }
            })


        }


        function done(number, num) {
            number = number + 1
            if (number == num) {
                return resolve()
            }
        }

    });
}
