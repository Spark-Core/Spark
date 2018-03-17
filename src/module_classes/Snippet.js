module.exports = function(client) {
    return class Snippet {

        constructor(name, options) {
            this.name = name;
            if (!options) {options = {}}
            this.options = options
            this.client = client
        }
        export (module) {
            module.exports = this;
        }
    }
}
