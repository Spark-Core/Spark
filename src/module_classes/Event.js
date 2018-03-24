module.exports = function(client) {
    return class Event {

        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            if (!options) {
                options = {}
            }
            this.event = options.event
            this.disabled = options.disabled
            if (this.disabled) {
                this.client.config.disabled.add("events", this.name)
            }

        }

        disable() {
            this.client.config.disabled.add("events", this.name)
        }

        setEvent(event) {
            if (!event || typeof event != "string") {
                console.error(this.name + " | Error on function setEvent: | Please use a string")
            } else {
                this.event = event
            }
        }
        export (module) {
            module.exports = this;
        }

    }
}
