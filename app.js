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
            var data = await require("./src/search.js")(this)
            return data;
        }
        async start() {
            this.dataStore = await this.dataStore;
            if (this.config.first) {console.log(`Welcome to ${chalk.yellow(`Spark V${this.version}`)}!\nTo see the changelog for this update go to this page:\n${chalk.blue("https://github.com/TobiasFeld22/Spark/releases")}\nTo learn more about using Spark, please visit our docs:\n${chalk.blue("https://discordspark.tk/")}\n-------------------`)}
            var commandtext = `${this.dataStore.commands.size} commands\n`
            var mftext = `${this.dataStore.functions.message.size} message functions\n`
            var bftext = `${this.dataStore.functions.boot.size} boot functions\n`
            if (this.dataStore.commands.size == 0) {
                commandtext = chalk.red(commandtext)
            } else {
                commandtext = chalk.green(commandtext)
            }
            if (this.dataStore.functions.message.size == 0) {
                mftext = chalk.red(mftext)
            } else {
                mftext = chalk.green(mftext)
            }
            if (this.dataStore.functions.boot.size == 0) {
                bftext = chalk.red(bftext)
            } else {
                bftext = chalk.green(bftext)
            }
            startBot(this)

            console.log(`Your bot (${chalk.yellow(this.user.tag)}) is now ${chalk.green("online!")} | Running on ${this.guilds.size} servers | ${chalk.yellow(`Spark v${this.version}`)}\nWe detected the following data:\n \n ${commandtext} ${mftext} ${bftext}`)
        }
        event() {
            this.on("message", () => {
                require("./loadEvents")
            })
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
