/* eslint init-declarations: 0 */
const discord = require("discord.js")
const chalk = require("chalk")
const startBot = require("./src/start.js")
const confirmConfig = require("./src/confirmConfig.js")
let Client;
if (Number(process.version.slice(1).split(".")[0]) < 8) {
    throw new Error("Your node.js version isnt high enough " + chalk.red(process.version) + " < " + chalk.green("8.0.0+") + "\nInstall a higher version of " + chalk.yellow("node.js") + " by going to " + chalk.blue("https://nodejs.org/en/download") + "\n---\nDownload node.js version " + chalk.green("8") + " or higher.\n\n If you want more information go to \n " + chalk.blue("https://discordspark.com/errors/outdated_nodejs") + "\n\n");
}

/*
    All modular classes
*/
exports.version = require("./package.json").version;
exports.DataStore = require("./src/dataStore.js")
exports.methods = {RichEmbed: discord.RichEmbed}
exports.CustomConfig = require("./src/CustomConfig.js")
exports.command = function(name, options) {
    const Command = require("./src/module_classes/Command.js")()

    return new Command(name, options, Client)
}

exports.observer = function(name, options) {
    const Observer = require("./src/module_classes/Observer.js")(Client)
    return new Observer(name, options)
}

exports.engine = function(name, options) {
    const Engine = require("./src/module_classes/Engine.js")(Client)
    return new Engine(name, options)
}

exports.snippet = function(name, options) {
    const Snippet = require("./src/module_classes/Snippet.js")(Client)
    return new Snippet(name, options)
}

exports.permission = function(name, options) {
    const Permission = require("./src/module_classes/Permission.js")(Client)
    return new Permission(name, options)
}

exports.event = function(name, options) {
    const Event = require("./src/module_classes/Event.js")(Client)
    return new Event(name, options)
}

exports.start = function(options) {
    return new Promise(function(resolve, reject) {

        if (!confirmConfig(options)) {
            return reject("There was an error in your configuration setup, There may be additional messages above.")
        }
        if (typeof options.ignoreBots != "boolean" && typeof options.ignoreBots != "string" && options.ignoreBots != null) {
            console.log(`You're trying to start with ${chalk.red("an invalid option:")} ${chalk.red("ignoreBots")}, Please read this article on the docs on how to use this option: ${chalk.blue("https://discordspark.com/documentation/config")}`)
            return reject()
        }
        if (options.ignoreBots == true) {
            options.ignoreBots = 4;
        } else if (options.ignoreBots == false) {
            options.ignoreBots = null
        } else if (options.ignoreBots == "message") {
            options.ignoreBots = 1
        } else if (options.ignoreBots == "command") {
            options.ignoreBots = 2
        }

        Client = class Client extends discord.Client {
            constructor(config) {
                super(config)
                this.version = require("./package.json").version
                this.config = {}
                this.customConfig = new exports.DataStore()
                this.CustomConfig = exports.CustomConfig
            }

            async search() {
                var data = await require("./src/search.js").func(this)
                return data;
            }
            async start() {
                this.dataStore = await this.dataStore;
                if (this.config.first) {
                    console.log(`Welcome to ${chalk.yellow(`Spark V${this.version}`)}!\nTo see the changelog for this update go to this page:\n${chalk.blue("https://github.com/TobiasFeld22/Spark/releases")}\nTo learn more about using Spark, please visit our docs:\n${chalk.blue("https://discordspark.com/")}\n-------------------`)
                }

                function colours(text, size) {
                    if (size == 0) {
                        return chalk.red(text)
                    }
                    return chalk.green(text)
                }
                var commandtext = colours(`${this.dataStore.commands.size} commands\n`, this.dataStore.commands.size)
                var observertext = colours(`${this.dataStore.functions.observer.size} observers\n`, this.dataStore.functions.observer.size)
                var enginetext = colours(`${this.dataStore.functions.engines.size} engines\n`, this.dataStore.functions.engines.size)
                var snippettext = colours(`${this.dataStore.functions.snippet.size} snippets\n`, this.dataStore.functions.snippet.size)
                var permissiontext = colours(`${this.dataStore.permissions.size} permissions\n`, this.dataStore.permissions.size)
                var eventtext = colours(`${this.dataStore.events.size} events\n`, this.dataStore.events.size)
                startBot(this)

                console.log(`Your bot (${chalk.yellow(this.user.tag)}) is now ${chalk.green("online!")} | Running on ${this.guilds.size} servers | ${chalk.yellow(`Spark v${this.version}`)}\nWe detected the following data:\n \n ${commandtext} ${observertext} ${enginetext} ${snippettext} ${permissiontext} ${eventtext}`)
            }

        }
        Client = new Client(options.clientOptions);
        Client.on("cc_update", function(data) {
            Client.customConfig.set(data.id, data)
        });
        Client.config = options
        Client.login(options.token).then(async () => {
            try {
                var application = await Client.fetchApplication()
                Client.config.ownerID = application.owner.id
            } catch (e) {
                console.log(e)
                throw Error("Couldn't fetch application, token may be a invalid / user token. ")
            }
            Client.guilds.forEach(i => {
                i.customConfig = new exports.CustomConfig(Client, i.id);
                Client.customConfig.set(i.id, i.customConfig)
            })
            Client.dataStore = await Client.search()
            Client.snippets = {
                list: (name) => {
                    if (!name) {
                        return Client.dataStore.functions.snippet.map((i, n) => n)
                    } else if (Client.dataStore.functions.snippet.has(name)) {
                        return Client.dataStore.functions.snippet.get(name)
                    }
                    return null;
                }
            }
            Client.dataStore.functions.snippet.forEach((i, n) => {
                Client.snippets[n] = i.snippet.code
            })
            Client.start(Client)
        }).catch(err => {
            return reject(console.error("An error occured while trying to login, check your token.", err))
        })

    });
}
