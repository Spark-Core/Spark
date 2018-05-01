module.exports = function() {
    return class Command {

        constructor(name, options, client) {
            this.name = name;
            if (!options) {
                options = {}
            }
            this.options = options
            this.client = client
            this.aliases = []
            this.level = (options.level || 0)
            this.helpFields = []
            this.dms = false
            this.description = "No Description Provided"
            this.disabled = options.disabled
            if (this.disabled) {
                this.client.config.disabled.add("commands", this.name)
            }

        }

        disable() {
            this.client.config.disabled.add("commands", this.name)
        }

        addAlias(alias) {
            if (typeof alias != "string") {
                return console.log("Incorrect alias type, use a string")
            }
            if (this.aliases.map(i => (i.name)).indexOf == -1) {
                return console.log("This alias was already added.")
            }
            this.aliases.push({
                name: alias,
                command: this
            })
        }

        setLevel(level) {
            if (typeof level != "number") {
                return console.log("To set a level, use a number")
            }
            this.level = level;
        }

        allowDms(allow) {
            if (typeof allow != "boolean") {
                return console.log("To set allowDms, use a boolean")
            }
            this.dms = allow;
        }

        setDescription(description) {
            if (typeof description != "string") {
                return console.log("To set a description, use a string")
            }
            this.description = description;
        }
        addHelpField(title, desc, inline) {
            this.helpFields.push({
                title,
                desc,
                inline
            })
        }

        export (module) {
            module.exports = this;
        }
    }

}
