module.exports = function(client) {
    return class Permission {

        constructor(name, options) {
            this.name = name;
            if (!options) {options = {}}
            this.options = options
            this.client = client
            this.level = (options.level || 0)
            this.disabled = options.disabled
            if (this.disabled) {
                this.client.config.disabled.add("permissions", this.name)
            }

        }
        disable() {
            this.client.config.disabled.add("permissions", this.name)
        }
        setLevel(level) {
            if (typeof level != "number") {
                return console.log("To set a level, use a number")
            }
            this.level = level;
        }
        export (module) {
            module.exports = this;
        }
    }
}
