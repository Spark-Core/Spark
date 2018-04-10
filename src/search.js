/* eslint class-methods-use-this: ["error", { "exceptMethods": ["searchLocations"] }] */
/* eslint no-console: 0 */
/* eslint class-methods-use-this: 0 */

const {
    resolve,
    dirname
} = require("path");
const fs = require("fs-extra")
const DataStore = require("./dataStore.js")
module.exports = {}

module.exports.SearchLoader = class SearchLoader {

    constructor(client) {
        this.client = client;
        if (dirname(__dirname, "/../") == dirname(require.main.filename)) {
            this.clientLocations = this.searchLocations(dirname(__dirname, "/../"))
        } else {
            this.clientLocations = this.searchLocations(dirname(__dirname, "/../"))
            this.userLocations = this.searchLocations(dirname(require.main.filename))
        }
        this.loadCommands = require("./search_files/loadCommands.js")
        this.loadObserver = require("./search_files/loadObserver.js")
        this.loadEngines = require("./search_files/loadEngines.js")
        this.loadSnippets = require("./search_files/loadSnippet.js")
        this.loadPermissions = require("./search_files/loadPermission.js")
        this.loadEvents = require("./search_files/loadEvent.js")
    }

    searchLocations(location) {
        return {
            "commands": resolve(location, "commands"),
            "functions": resolve(location, "functions"),
            "observers": resolve(location, "functions/observers"),
            "engines": resolve(location, "functions/engines"),
            "snippets": resolve(location, "functions/snippets"),
            "events": resolve(location, "events"),
            "permissions": resolve(location, "permissions")
        }
    }

    async loadAll(locations) {
        this.dataStore = {}
        await this.loadCommands(this, locations.commands)
        if (!(await fs.exists(locations.functions))) {
            await this.genFolder(locations.functions)
        }
        this.aliases = new DataStore()
        await this.loadObserver(this, locations.observers)
        await this.loadEngines(this, locations.engines)
        await this.loadSnippets(this, locations.snippets)
        await this.loadPermissions(this, locations.permissions)
        await this.loadEvents(this, locations.events)
        return this.dataStore;
    }

    async genFolder(location) {
        this.client.config.first = true;
        try {
            await fs.mkdir(location)
        } catch (e) {
            console.error(`${location} | Error while trying to generate folder: \n ${e}`)
        }
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
            return new DataStore()
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

    merge(c, u) {
        if (!u) {
            return c
        }
        u.commands.forEach((i, n) => {
            c.commands.set(n, i)
        })
        u.functions.observer.forEach((i, n) => {
            c.functions.observer.set(n, i)
        })
        u.functions.engines.forEach((i, n) => {
            c.functions.engines.set(n, i)
        })
        u.functions.snippet.forEach((i, n) => {
            c.functions.snippet.set(n, i)
        })
        u.permissions.forEach((i, n) => {
            c.permissions.set(n, i)
        })
        u.aliases.forEach((i, n) => {
            c.aliases.set(n, i)
        })
        u.events.forEach((i, n) => {
            c.events.set(n, i)
        })
        return c;
    }

}
module.exports.func = async (client) => {
    var loader = new module.exports.SearchLoader(client)
    return loader.merge(await loader.loadAll(loader.clientLocations), await loader.loadAll(loader.userLocations))
}
