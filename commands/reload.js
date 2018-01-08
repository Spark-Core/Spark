/* eslint no-console: 0 */
/* eslint max-lines: ["error", 350] */
exports.name = "reload";
// owner only
exports.level = 10;
exports.ignoredChannels = [];
// Don't use this for regular commands.
exports.system = true
// Don't use this for regular commands.
const setup = require("../setup.js");
var childProcess = require("child_process");
exports.command = function(client, message) {
  var content = message.content.split(" ");
  var args = content.replace(client.prefix, "").split(" ");
    if (args[1] == null) {
        args[1] = ""
    }
    switch (args[1].toLowerCase()) {
        case "commands":
            checkGit(message, args).then(edit => {
                reloadcommands(client, message, edit)
            })
            break;
        case "functions":
            checkGit(message, args).then(edit => {
                reloadfunctions(client, message, edit)
            })
            break;
        case "all":
            checkGit(message, args).then(edit => {
                reloadall(client, message, edit)
            })
            break;
        default:
            message.channel.send("You forgot to specify what to reload, choose from: `commands` `functions` `all`")
    }
}

function checkGit(message, args) {
    return new Promise(function(resolve) {
        if (args[2] != null && args[2].toLowerCase() === "--git") {
            childProcess.exec("git pull", (error, stdout, stderr) => {
                if (error || stderr) {
                    var choice = stderr;
                    if (error) {
                        choice = error;
                    }
                    message.channel.send(`Pulling from git repo failed:\n\`\`\`${choice}\`\`\`\n\nReloading...`).then(m => {
                        resolve(m)
                    })
                } else {
                    message.channel.send(`Pulled from git repo succesfully:\n\`\`\`${stdout}\`\`\`\n\nReloading...`).then(m => {
                        resolve(m)
                    })
                }
            })
        } else {
            resolve()
        }
    })
}

function reloadall(client, message, edit) {
    if (edit != null) {
        var m = edit
        return setup(client.config, require("path").dirname(require.main.filename), true).then((data) => {
            client.commanddata = data.commands;
            var tempsnips = new Map();
            client.functions = data.functions
            client.functions.types = {
                messages: [],
                commands: []
            }
            data.functions.snippets.snippets.forEach(i => {
                tempsnips.set(i.name, i.function)
            })
            client.snippets = tempsnips
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
            var system = 0;
            var regular = 0;
            var amount = 0
            var commandissues = data.commands.commands.issues;
            data.commands.commands.forEach((i) => {
                amount = amount + 1
                if (i.system) {
                    system = system + 1
                } else {
                    regular = regular + 1
                }
            })
            amount = (amount - data.commands.issues)
            var functionissues = 0;
            var functionamount = 0;
            functionissues = (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues)
            functionamount = (data.functions.messages.messagefuncs.size + data.functions.boot.bootfuncs.size + data.functions.snippets.snippets.size)
            if (functionissues > 0) {
                functionamount = (functionamount - functionissues);
            }
            var Text = "";
            Text = Text + "**Commands**\nReloaded **" + amount + "** commands succesfully. (S" + system + " | R" + regular + ")"
            if (commandissues > 1) {
                Text = Text + "\n**" + commandissues + "** command(s) failed to load. See the console for more information."
            }
            Text = Text + "\n**Functions**\nReloaded **" + functionamount + "** functions succesfully."
            if (functionissues > 1) {
                Text = Text + "\n**" + functionissues + "** function(s) failed to load. See the console for more information."
            }
            m.edit(m.content.replace("Reloading...", Text));
        })
    }
    return setup(client.config, require("path").dirname(require.main.filename), true).then((data) => {
        client.commanddata = data.commands;
        var tempsnips = new Map();
        client.functions = data.functions
        client.functions.types = {
            messages: [],
            commands: []
        }
        data.functions.snippets.snippets.forEach(i => {
            tempsnips.set(i.name, i.function)
        })
        client.snippets = tempsnips
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
        var system = 0;
        var regular = 0;
        var amount = 0
        var commandissues = data.commands.commands.issues;
        data.commands.commands.forEach((i) => {
            amount = amount + 1
            if (i.system) {
                system = system + 1
            } else {
                regular = regular + 1
            }
        })
        amount = (amount - data.commands.issues)
        var functionissues = 0;
        var functionamount = 0;
        functionissues = (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues)
        functionamount = (data.functions.messages.messagefuncs.size + data.functions.boot.bootfuncs.size + data.functions.snippets.snippets.size)
        if (functionissues > 0) {
            functionamount = (functionamount - functionissues);
        }
        var Text = "";
        Text = Text + "**Commands**\nReloaded **" + amount + "** commands succesfully. (S" + system + " | R" + regular + ")"
        if (commandissues > 1) {
            Text = Text + "\n**" + commandissues + "** command(s) failed to load. See the console for more information."
        }
        Text = Text + "\n**Functions**\nReloaded **" + functionamount + "** functions succesfully."
        if (functionissues > 1) {
            Text = Text + "\n**" + functionissues + "** function(s) failed to load. See the console for more information."
        }
        message.channel.send(Text)
    })
}

function reloadcommands(client, message, edit) {
    if (edit != null) {
        var m = edit;
        var temp = client.config
        return setup(client.config, require("path").dirname(require.main.filename), true).then((commands) => {
            client.commanddata = commands.commands;
            client.config = temp;
            var system = 0;
            var regular = 0;
            commands.commands.commands.forEach((i) => {
                if (i.system) {
                    system = system + 1
                } else {
                    regular = regular + 1
                }
            })
            if (commands.issues > 0) {
                return m.edit(m.content.replace("Reloading...", "[Spark] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")\n**" + commands.issues + "** command(s) failed to load. See the console for more info."))
            }
            return m.edit(m.content.replace("Reloading...", "[Spark] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")"))
        }).catch((err) => {
            console.error(err.stack)
            return m.edit(m.content.replace("Reloading...", "An error occurred while trying to reload, see error info in the console."))
        })
    }
    message.channel.send("[Spark] reloading commands").then(m => {
        var temp = client.config
        setup(client.config, require("path").dirname(require.main.filename), true).then((commands) => {
            client.commanddata = commands.commands;
            client.config = temp;
            var system = 0;
            var regular = 0;
            commands.commands.commands.forEach((i) => {
                if (i.system) {
                    system = system + 1
                } else {
                    regular = regular + 1
                }
            })
            if (commands.issues > 1) {
                return m.edit("[Spark] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")\n**" + commands.issues + "** commands failed to load. See the console for more info.")
            } else if (commands.issues == 1) {
                return m.edit("[Spark] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")\n**" + commands.issues + "** command failed to load. See the console for more info.")
            }
            m.edit("[Spark] Reloaded **" + (system + regular) + "** commands succesfully. (S" + system + " | R" + regular + ")")
        }).catch((err) => {
            m.edit(err.stack.toLowerCase())
            if (client.developer) {
                console.log("error while reloading: \n", err.stack)
            }
        })
    })
}

function reloadfunctions(client, message, edit) {
    if (edit != null) {
        var m = edit;
        var temp = client.config;
        return setup(temp, require("path").dirname(require.main.filename), true).then((data) => {
            var tempsnips = new Map();
            client.functions = data.functions
            client.functions.types = {
                messages: [],
                commands: []
            }
            data.functions.snippets.snippets.forEach(i => {
                tempsnips.set(i.name, i.function)
            })
            client.snippets = tempsnips
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
            client.config = temp;
            if ((data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) > 1) {
                return m.edit(m.content.replace("Reloading...", "[Spark] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) + "** issues while loading. See the console for more info."))
            } else if ((data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) === 1) {
                return m.edit(m.content.replace("Reloading...", "[Spark] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) + "** issue while loading. See the console for more info."))
            }
            return m.edit(m.content.replace("Reloading...", "[Spark] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully."))
        }).catch((err) => {
            console.error(err.stack)
            return m.edit(m.content.replace("Reloading...", "An error occurred while trying to reload, see error info in the console."))
        })

    }
    message.channel.send("[Spark] reloading functions").then(m => {
        var temp = client.config;
        setup(temp, require("path").dirname(require.main.filename), true).then((data) => {
            var tempsnips = new Map();
            client.functions = data.functions
            client.functions.types = {
                messages: [],
                commands: []
            }
            data.functions.snippets.snippets.forEach(i => {
                tempsnips.set(i.name, i.function)
            })
            client.snippets = tempsnips
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
            client.config = temp;
            if ((data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) > 1) {
                return m.edit("[Spark] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) + "** issues while loading. See the console for more info.")
            } else if ((data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) === 1) {
                return m.edit("[Spark] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.\n**" + (data.functions.messages.issues + data.functions.boot.issues + data.functions.snippets.issues) + "** issue while loading. See the console for more info.")
            }
            m.edit("[Spark] Reloaded **" + (client.functions.messages.messagefuncs.size + client.functions.boot.bootfuncs.size + client.functions.snippets.snippets.size) + "** messagefunctions, bootfunctions and snippets succesfully.")
        }).catch((err) => {
            m.edit(err.stack.toLowerCase())
        })
    })
}
