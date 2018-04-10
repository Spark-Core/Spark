module.exports = function(client) {
    return class Snippet {

        constructor(name, options) {
            this.name = name;
            if (!options) {options = {}}
            this.options = options
            this.client = client
            this.disabled = options.disabled
            if (this.disabled) {
                this.client.config.disabled.add("snippets", this.name)
            }

        }

        disable() {
            this.client.config.disabled.add("snippets", this.name)
        }

        export (module) {
            module.exports = this;
        }
    }
}
