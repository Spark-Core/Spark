module.exports = function(client) {
    return class MF {

        constructor(name, options) {
            this.name = name;
            this.options = options
            this.client = client
            if (!options) {
                options = {}
            }
            this.type = options.type
            client.addMF(this.name, this)
        }


        setType(type) {
            if (!type || typeof type != "string" || ![
                    "messages",
                    "commands",
                    "all"
                ].includes(type)) {
                console.error(this.name + " | Error on function setType: | Please use one of these 3 types: \"messages\" \"commands\" \"all\"")
            } else {
                this.type = type
            }


        }


    }
}
