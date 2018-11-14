/* eslint prefer-destructuring: 0  */
const Spark = require("../../")
const observer = Spark.observer("prefixHelp")
observer.setType("message")

observer.code = (client, message) => {
    let first = message.content;
    if (message.content.includes(" ") > 0) {
        return
    }
    first = first.match(/<@!?[0-9]+>/g)
    if (first) {
        if (client.user.id == first[0].replace(/<@!?/, "").slice(0, -1)) {
            prefixHelp(client, message)
        }
    }
    return false;
}

module.exports = observer;

function prefixHelp(client, message) {
    if (client.customConfig.has(message.guild.id)) {
        const {prefix} = client.customConfig.get(message.guild.id)

        if (typeof prefix == "string") {
            message.channel.send("My prefix is: `" + prefix + "`")
            return false;
        } else if (typeof prefix == "object" && prefix.constructor.name == "Array") {
            if (prefix.length == 1) {
                message.channel.send("My prefix is: `" + prefix[0] + "`")
                return false;
            }
            message.channel.send("My prefixes are: " + prefix.map(i => "`" + i + "`").join(" "))
            return false;
        }
    }
    if (client.config.prefix.length > 1) {
        message.channel.send("My prefixes are: " + client.config.prefix.map(i => "`" + i + "`").join(" "))
    } else {
        message.channel.send("My prefix is: `" + client.config.prefix + "`")
    }
}
