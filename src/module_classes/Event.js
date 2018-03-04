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
        }


        setEvent(event) {
            if (!event || typeof event != "string") {
                console.error(this.name + " | Error on function setEvent: | Please use a string")
            } else {
                this.event = event
            }
        }


    }
}
