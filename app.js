/* eslint no-console: 0 */
/* eslint init-declarations: 0 */
const discord = require("discord.js")
const fs = require("fs-extra")
let Client;

exports.command = function(name, options) {
    const Command = require("./src/command.js")(Client)

    return new Command(name, options)
}

exports.start = function(options) {
    Client = class Client extends discord.Client {
        constructor() {
            super()
            this.version = require("./package.json").version
            this.commands = new Map()
            this.command = exports.command
            this.search()

        }


        addCommand(name, command) {
            if (this.commands.has(name)) {
                return
            }
            this.commands.set(name, command)

        }

        async search() {

            var list = await fs.readdir("./commands/")
            list.filter(x => {
                return x.endsWith(".js")
            }).forEach(i => {
                if (i == "test.js") {
                    var temp = require("./commands/" + i)
                    this.addCommand(temp.name, temp)
                }
            })
            return this

        }
    }
    Client = new Client();

    Client.login(options.token)
    console.log(Client.commands)

}
