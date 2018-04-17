var DisableCache = require("./DisableCache.js")
class CustomConfig {

    constructor(client, id) {
        this.id = id;
        this.client = client;
        this.ignoreBots = null;
        this.disabled = new DisableCache({})
    }

    setPrefix(prefix) {
        if (typeof prefix == "string") {
            this.prefix = [];
            this.prefix.push(prefix)
            this.client.emit("cc_update", this)
            return "success"
        } else if (typeof prefix == "object" && prefix.constructor.name == "Array") {
            if (prefix.filter(i => {
                    return typeof i == "string"
                }).length === prefix.length) {
                this.prefix = prefix;
                this.client.emit("cc_update", this)
                return "success"
            }
            throw new Error("Expected argument to be String or Array including string")

        } else {
            throw new Error("Expected argument to be String or Array including string")
        }
    }
    clearPrefix() {
        this.prefix = null;
        this.client.emit("cc_update", this)
    }
    setIgnoreBots(type) {
        if (typeof type != "string" && typeof type != "boolean") {
            throw new Error("Expected argument to be a string or boolean.")
        }
        if (type == true) {
            this.ignoreBots = 4;
            this.client.emit("cc_update", this)
        } else if (type == false) {
            this.ignoreBots = 0;
            this.client.emit("cc_update", this)
        } else if (type == "message") {
            this.ignoreBots = 1;
            this.client.emit("cc_update", this)
        } else if (type == "command") {
            this.ignoreBots = 2;
            this.client.emit("cc_update", this)
        }
    }
    clearIgnoreBots() {
        this.ignoreBots = null;
        this.client.emit("cc_update")
    }
    disable(type, name) {
        this.disabled.add(type, name)
    }
    enable(type, name) {
        this.disabled.remove(type, name)
    }
}
module.exports = CustomConfig
