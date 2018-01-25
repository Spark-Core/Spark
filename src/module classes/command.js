module.exports = function(client) {
    return class Command {

        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            this.aliases = []
        }


        addAlias(alias) {
            if (typeof alias != "string") {
                return console.log("Incorrect alias type, use a string")
            }
            if (this.aliases.map(i => (i.name)).indexOf == -1) {
                return console.log("This alias was already added.")
            }
            this.aliases.push({name: alias, command: this})
        }


    }
}
