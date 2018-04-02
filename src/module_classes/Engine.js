module.exports = function(client) {
    return class Engine {
        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            if (!options) {
                options = {}
            }
            this.time = options.time
            this.delay = options.delay
            this.disabled = options.disabled
            if (this.disabled) {
                this.client.config.disabled.add("engine", this.name)
            }
        }


        setTime(nr) {
            if (!nr || typeof nr != "number") {
                console.error(this.name + " | Error on function setTime: | Please use a number that's greater then 0")
            } else {
                this.time = nr
            }
        }

        setDelay(nr) {
            if (!nr || typeof nr != "number") {
                console.error(this.name + " | Error on function setDelay: | Please use a number that's greater then 0")
            } else {
                this.delay = nr
            }
        }

        disable() {
            this.client.config.disabled.add("engines", this.name)
        }

        export (module) {
            module.exports = this;
        }

    }
}
