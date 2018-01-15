/* eslint class-methods-use-this: ["error", { "exceptMethods": ["searchLocations"] }] */



const {resolve,dirname} = require("path");
const {promisify} = require("util");
const fs = require("fs-extra")
module.exports = (client) => {

    class Searchloader {

        constructor(client) {
            this.client = client;



            this.clientLocations = this.searchLocations(dirname("../"))
            this.userLocations = this.searchLocations(dirname(require.main.filename))
        }

        searchLocations(location){
            return {
                "commands": resolve(location, "commands"),
                "messageFunctions": resolve(location, "functions/messages"),
                "bootFunctions": resolve(location, "functions/boot"),
                "snippets": resolve(location, "functions/snippets"),
                "events": resolve(location, "events"),
                "permissions": resolve(location, "permissions")
            }
        }

    }
    var loader = new Searchloader(client)
    return {clientLocations: loader.clientLocations, userLocations: loader.userLocations}
}
