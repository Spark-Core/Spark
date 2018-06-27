module.exports = function(client) {
    return class Observer {

        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            if (!options) {
                options = {}
            }
            if (options.type) {
                this.type = options.type
            }
            this.disabled = options.disabled
            if (this.disabled) {
                this.client.config.disabled.add("observers", this.name)
            }

        }

        disable() {
            this.disabled = true
            this.client.config.disabled.add("observers", this.name)
        }

        setType(type) {
            if (!type || typeof type != "string" || ![
                    "message",
                    "command",
                    "all"
                ].includes(type)) {
                console.error(this.name + " | Error on function setType: | Please use one of these 3 types: \"message\" \"command\" \"all\"")
                this.type = "all"
            } else {
                this.type = type
            }


        }
        export (module) {
            module.exports = this;
        }

    }
}
