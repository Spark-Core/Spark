module.exports = function() {
    return class Command {

        constructor(name, options, client) {
            this.name = name;
            if (!options) {options = {}}
            this.options = options
            this.client = client
            this.aliases = []
            this.level = (options.level || 0)
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
        setLevel(level) {
            if (typeof level != "number") {
                return console.log("To set a level, use a number")
            }
            this.level = level;
        }


    }
}
