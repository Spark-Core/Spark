/* eslint no-console: 0 */
/* eslint init-declarations: 0 */
const discord = require("discord.js")
let Client;

exports.command = function(name, options) {
    const Command = require("./src/command.js")(Client)

    return new Command(name, options)
}

exports.start = function(options) {
    if (typeof options != "object") {
        return console.log("You're trying to start without a token, please read this article on the docs on how to setup: https://discordspark.tk/getting-started")
    } else if (typeof options.token != "string") {
        return console.log("You're trying to start without a default prefix, please read this article on the docs on how to setup: https://discordspark.tk/getting-started")
    }

    Client = class Client extends discord.Client {
        constructor() {
            super()
            this.version = require("./package.json").version
            this.commands = new Map()
            this.command = exports.command
            this.events = {};
        }


        addCommand(name, command) {
            if (this.commands.has(name)) {
                return
            }
            this.commands.set(name, command)

        }

        search() {
            console.log("rest")
            var results = require("./src/search.js")(this)
            console.log(results)
            return this;
        }
        event() {
            this.on("message", () => {
                require("./loadEvents")
            })
        }
    }
    Client = new Client();

    Client.login(options.token).then(() => {
        Client.search()

    }).catch(err => {
        return console.error("An error occured while trying to login, check your token.", err)
    })

}
