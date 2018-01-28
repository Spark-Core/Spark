/* eslint init-declarations: 0 */
const discord = require("discord.js")
const chalk = require("chalk")
const startBot = require("./src/start.js")
let Client;


/*
    All modular classes
*/

exports.command = function(name, options) {
    const Command = require("./src/module classes/Command.js")(Client)

    return new Command(name, options)
}

exports.mf = function(name, options) {
    const MF = require("./src/module classes/Message_Function.js")(Client)
    return new MF(name, options)
}

exports.bf = function(name, options) {
    const BF = require("./src/module classes/Boot_Function.js")(Client)
    return new BF(name, options)
}

exports.snippet = function(name, options) {
    const Snippet = require("./src/module classes/Snippet.js")(Client)
    return new Snippet(name, options)
}

exports.permission = function(name, options) {
    const Permission = require("./src/module classes/Permission.js")(Client)
    return new Permission(name, options)
}

exports.start = function(options) {
    if (typeof options != "object") {
        return console.log(`You're trying to start without ${chalk.red("a starting object")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
    } else if (typeof options.token != "string") {
        return console.log(`You're trying to start without ${chalk.red("a valid token")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
    }
    if (typeof options.prefix == "string") {
        if (options.prefix.includes(" ")) {
            return console.log(`You're trying to start without ${chalk.red("a valid prefix")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
        }
        options.prefix = [options.prefix]
    } else if (options.prefix instanceof Array) {
        options.prefix.forEach(i => {
            if (i.includes(" ")) {
                return console.log(`You're trying to start without ${chalk.red("a valid prefix")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
            }
        })
    } else {
        return console.log(`You're trying to start without ${chalk.red("a valid prefix")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
    }

    Client = class Client extends discord.Client {
        constructor() {
            super()
            this.version = require("./package.json").version
            this.config = {}
        }


        async search() {
            var data = await require("./src/search/search.js")(this)
            return data;
        }
        async start() {
            this.dataStore = await this.dataStore;
            if (this.config.first) {console.log(`Welcome to ${chalk.yellow(`Spark V${this.version}`)}!\nTo see the changelog for this update go to this page:\n${chalk.blue("https://github.com/TobiasFeld22/Spark/releases")}\nTo learn more about using Spark, please visit our docs:\n${chalk.blue("https://discordspark.tk/")}\n-------------------`)}

            function colours(text, size) {
                if (size == 0) {
                    return chalk.red(text)
                }
                return chalk.green(text)
            }
            var commandtext = colours(`${this.dataStore.commands.size} commands\n`, this.dataStore.commands.size)
            var mftext = colours(`${this.dataStore.functions.message.size} message functions\n`, this.dataStore.functions.message.size)
            var bftext = colours(`${this.dataStore.functions.boot.size} boot functions\n`, this.dataStore.functions.boot.size)
            var snippettext = colours(`${this.dataStore.functions.snippet.size} snippets\n`, this.dataStore.functions.snippet.size)
            var permissiontext = colours(`${this.dataStore.permissions.size} permissions\n`, this.dataStore.permissions.size)
            startBot(this)

            console.log(`Your bot (${chalk.yellow(this.user.tag)}) is now ${chalk.green("online!")} | Running on ${this.guilds.size} servers | ${chalk.yellow(`Spark v${this.version}`)}\nWe detected the following data:\n \n ${commandtext} ${mftext} ${bftext} ${snippettext} ${permissiontext}`)
        }

    }
    Client = new Client();
    Client.config = options
    Client.login(options.token).then(() => {
        Client.dataStore = Client.search()

        Client.start(Client)

    }).catch(err => {
        return console.error("An error occured while trying to login, check your token.", err)
    })

}
