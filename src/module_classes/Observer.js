module.exports = function(client) {
    return class Observer {

        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            if (!options) {
                options = {}
            }
            this.type = options.type
        }


        setType(type) {
            if (!type || typeof type != "string" || ![
                    "message",
                    "command",
                    "all"
                ].includes(type)) {
                console.error(this.name + " | Error on function setType: | Please use one of these 3 types: \"messages\" \"commands\" \"all\"")
            } else {
                this.type = type
            }


        }


    }
}
