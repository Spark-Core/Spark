/* eslint class-methods-use-this: ["error", { "exceptMethods": ["searchLocations"] }] */
/* eslint no-console: 0 */


const {
    resolve,
    dirname
} = require("path");
const fs = require("fs-extra")
module.exports = (client) => {

    class Searchloader {

        constructor(client) {
            this.client = client;


            this.aliases = new Map()
            this.clientLocations = this.searchLocations(dirname("../"))
            this.userLocations = this.searchLocations(dirname(require.main.filename))
        }

        searchLocations(location) {
            return {
                "commands": resolve(location, "commands"),
                "messageFunctions": resolve(location, "functions/messages"),
                "bootFunctions": resolve(location, "functions/boot"),
                "snippets": resolve(location, "functions/snippets"),
                "events": resolve(location, "events"),
                "permissions": resolve(location, "permissions")
            }
        }

        async loadAll(locations) {

            await this.loadCommands(locations.commands)
            //    this.loadMF(locations.messageFunctions),
            //    this.loadBF(locations.bootFunctions),
            //    this.loadSnippets(locations.snippets),
            //    this.loadEvents(locations.events),
            //    this.loadPermissions(locations.permissions)
            return this;
        }


        async loadCommands(location) {
            this.client.commands = new Map();
            var tempcommands = await this.searchInDirectories(location);
            var commands = [];
            tempcommands.forEach(i => {
                try {
                    var temp = require(i)
                    commands.push({
                        command: temp,
                        location: i
                    })
                } catch (e) {
                    console.error(`${i} | Error while loading command: \n ${e}`)
                }

            })

            commands.forEach(i => {
                var {command} = i
                if (command.constructor.name !== "Command") {
                    console.warn(`${i.location} | Error while loading command: \n File is not a Command class | See https://discordspark.tk/docs/commands for more info.`)
                    i = null;
                    return;
                }
                if (command.aliases.length > 0) {
                    command.aliases.forEach(i => {
                        if (!this.aliases.has(i)) {
                            this.aliases.set(i, command.name)
                        }
                    })
                }
                if (typeof command.code != "function") {
                    console.warn(`${i.location} | Error while loading command: \n No code specified. | see https://discordspark.tk/docs/commands for more info.`)
                    i = null;
                    // add return if more checks are added.
                }

            })
            commands = commands.filter(i => {
                return i != null
            })
            return commands;
        }

        async searchInDirectories(location, notFirst) {
            var files = await fs.readdir(location)
                .catch(err => {
                    return console.error("An error occurred while searching directories.", err)
                })
            var jsFiles = files.filter(i => {
                return i.endsWith(".js")
            })
            jsFiles = jsFiles.map(i => (resolve(location, i)))
            if (!files) {
                return new Map()
            }
            if (!notFirst) {
                var folders = files.filter(i => {
                    return !(i.includes("."))
                })
                var all = folders.map(i => (this.searchInDirectories(resolve(location, i), true)))
                var data = await Promise.all(all)
                data.forEach(i => {
                    i.forEach(i => {
                        jsFiles.push(resolve(location, i))
                    })
                })
            }
            return jsFiles







        }


    }
    var loader = new Searchloader(client)
    loader.loadAll(loader.clientLocations);
    loader.loadAll(loader.userLocations);
    // combine and return here.
}
