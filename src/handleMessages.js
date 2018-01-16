/* eslint no-console: 0 */
exports.doCommand = (command, client, message) => {
    command = client.commanddata.commands.get(command);
    if (command === undefined) {
        return
    }

    var stop = false;
    var amount = 0
    client.permissions.filter(i => {return i.level == command.level}).forEach(i => {
        if (stop == true){return}
        var result = i.filter(client, message)
        if (result instanceof Promise){
            result
            .then(r => {
                amount = amount + 1
                if (amount == client.permissions.filter(i => {return i.level == command.level}).length){
                    if (!stop){c()}
                    return
                }
                if (r == true){stop = true}
            }).catch(err => {return console.warn(err)})
        }else if (result == true){stop = true}
        amount = amount + 1
        if (amount == client.permissions.filter(i => {return i.level == command.level}).length){
            if (!stop){c()}
        }
    })
    function c(){
    try {
        command.command(client, message);
    } catch (err) {
        if (client.developer) {
            console.warn("Command: " + command.name + " | had an error while executing.", err)
        } else if (err.code == "MODULE_NOT_FOUND") {
            var mod = err.stack.split("\n")[0].replace("Error: Cannot find module ", "")
            console.warn("Command: " + command.name + " | Requires the " + mod + " package to be installed.\nTo install this package, close the script and type: 'npm install " + mod.slice(1, -1) + "'")
            if (message.author.id == client.config.owner_id) {
                message.channel.send("[Spark] Command: **" + command.name + "** | Requires the " + mod + " package to be installed.\nTo install this package, close the script and type: `npm install " + mod.slice(1, -1) + "`")
            }
        } else {
            console.warn("Command: " + command.name + " | had an error. Show the developer of the command module that you are getting this error code: \n" + err)
        }
    }
    }
}
exports.dofuncs = (client, message, type) => {
    return new Promise(function(resolve, reject) {
        var funcnumber = 0;
        var number = 0;
        if (type == "message") {
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
                if (result instanceof Promise) {
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
                if (result instanceof Promise) {
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
                    if (result) {
                        if (typeof result == "string") {
                            message.channel.send(result)
                        }
                        return reject()
                    }
                    done(number, num)
                }
            })
        }

        function done(xnumber, num) {
            number = xnumber + 1
            if (number == num) {
                return resolve()
            }
        }
    });
}
