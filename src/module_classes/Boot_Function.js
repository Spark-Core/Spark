module.exports = function(client) {
    return class BF {

        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            if (!options) {
                options = {}
            }
            this.time = options.time
            this.delay = options.delay
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
        export (module) {
            module.exports = this;
        }

    }
}
