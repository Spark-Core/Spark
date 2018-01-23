module.exports = function(client) {
    return class Command {

        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            this.aliases = []
            client.addCommand(this.name, this)
        }


        addAlias(alias) {
            var {aliases} = this.client.commands.get(this.name)
            if (!aliases.includes(alias)) {
                aliases.push(alias)
            }
        }


    }
}
