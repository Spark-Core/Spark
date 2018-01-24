/* eslint class-methods-use-this: ["error", { "exceptMethods": ["searchLocations"] }] */
/* eslint no-console: 0 */
/* eslint class-methods-use-this: 0 */

const {resolve, dirname} = require("path");
const fs = require("fs-extra")
module.exports = (client) => {

    class Searchloader {

        constructor(client) {
            this.client = client;

            this.aliases = new Map()
            if (dirname(__dirname, "/../") == dirname(require.main.filename)) {
                this.clientLocations = this.searchLocations(dirname(__dirname, "/../"))
            } else {
                this.clientLocations = this.searchLocations(dirname(__dirname, "/../"))
                this.userLocations = this.searchLocations(dirname(require.main.filename))
            }
        }

        searchLocations(location) {
            return {
                "commands": resolve(location, "commands"),
                "functions": resolve(location, "functions"),
                "messageFunctions": resolve(location, "functions/messages"),
                "bootFunctions": resolve(location, "functions/boot"),
                "snippets": resolve(location, "functions/snippets"),
                "events": resolve(location, "events"),
                "permissions": resolve(location, "permissions")
            }
        }

        async loadAll(locations) {

            await this.loadCommands(locations.commands)
            if (!(await fs.exists(locations.functions))) {
                await this.genFolder(locations.functions)
            }
            await this.loadMF(locations.messageFunctions)
            await this.loadBF(locations.bootFunctions)
            //    this.loadSnippets(locations.snippets)
            //    this.loadEvents(locations.events)
            //    this.loadPermissions(locations.permissions)
            return this;
        }

        async genFolder(location) {
            try {
                await fs.mkdir(location)
            } catch (e) {
                console.error(`${location} | Error while trying to generate folder: \n ${e}`)
            }
        }

        async loadCommands(location) {
            this.client.commands = new Map();
            var tempcommands = await this.searchInDirectories(location);
            var commands = [];
            tempcommands.forEach(i => {
                try {
                    var temp = require(i)
                    commands.push({command: temp, location: i})
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

        async loadMF(location) {
            if (!this.client.functions) {
                this.client.functions = {};
            }
            this.client.functions.message = new Map();
            var temp = await this.searchInDirectories(location);
            var mf = [];
            temp.forEach(i => {
                try {
                    var temp = require(i)
                    mf.push({mf: temp, location: i})
                } catch (e) {
                    console.error(`${i} | Error while loading message function: \n ${e}`)
                }

            })

            mf.forEach(i => {
                var {mf} = i
                if (mf.constructor.name !== "MF") {
                    console.warn(`${i.location} | Error while loading message function: \n File is not a message function class | See https://discordspark.tk/docs/message_function for more info.`)
                    i = null;
                    return;
                }
                if (typeof mf.type != "string" || ![
                        "messages",
                        "commands",
                        "all"
                    ].includes(mf.type)) {
                    mf.type = "all"
                }
                if (typeof mf.code != "function") {
                    console.warn(`${i.location} | Error while loading message function: \n No code specified. | see https://discordspark.tk/docs/message_function for more info.`)
                    i = null;
                    // add return if more checks are added.
                }

            })
            mf = mf.filter(i => {
                return i != null
            })
            return mf;
        }

        async loadBF(location) {
            if (!this.client.functions) {
                this.client.functions = {};
            }
            this.client.functions.message = new Map();
            var temp = await this.searchInDirectories(location);
            var bf = [];
            temp.forEach(i => {
                try {
                    var temp = require(i)
                    bf.push({bf: temp, location: i})
                } catch (e) {
                    console.error(`${i} | Error while loading boot function: \n ${e}`)
                }

            })

            bf.forEach(i => {
                var {bf} = i
                if (bf.constructor.name !== "BF") {
                    console.warn(`${i.location} | Error while loading boot function: \n File is not a boot function class | See https://discordspark.tk/docs/boot_function for more info.`)
                    i = null;
                    return;
                }
                if (typeof bf.time != "number") {
                    bf.time = 0
                }
                if (typeof bf.delay != "number") {
                    bf.delay = 0
                }
                if (typeof bf.code != "function") {
                    console.warn(`${i.location} | Error while loading boot function: \n No code specified. | see https://discordspark.tk/docs/boot_function for more info.`)
                    i = null;
                    // add return if more checks are added.
                }

            })
            bf = bf.filter(i => {
                return i != null
            })
            return bf;
        }

        async searchInDirectories(location, notFirst) {
            var files = null;
            try {
                files = await fs.readdir(location)
            } catch (err) {

                if (err.code == "ENOENT") {
                    await this.genFolder(location)
                    var x = await this.searchInDirectories(location, notFirst)
                    return x;
                }
                return console.error("An error occurred while searching directories.", err)
            }
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
    return loader;
    // combine and return here.
}
