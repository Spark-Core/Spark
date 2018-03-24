var DisableCache = require("./DisableCache.js")
var chalk = require("chalk")
module.exports = (options) => {
    if (typeof options != "object") {
        return console.log(`You're trying to start without ${chalk.red("a starting object")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
    } else if (typeof options.token != "string") {
        return console.log(`You're trying to start without ${chalk.red("a valid token")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
    }
    if (options.disabled == null) {
        options.disabled = new DisableCache({})
    } else if (typeof options.disabled == "object") {
        options.disabled = new DisableCache(options.disabled)
    } else {
        options.disabled = new DisableCache({})
    }
    if (typeof options.prefix == "string") {
        if (options.prefix.includes(" ")) {
            return console.log(`You're trying to start without ${chalk.red("a valid prefix")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
        }
        options.prefix = [options.prefix]
    } else if (options.prefix instanceof Array) {
        options.prefix.forEach(i => {
            if (i.includes(" ")) {
                return console.log(`You're trying to start without ${chalk.red("a valid prefix")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
            }
        })
    } else {
        return console.log(`You're trying to start without ${chalk.red("a valid prefix")}, please read this article on our docs on how to setup your bot: ${chalk.blue("https://discordspark.tk/getting-started")}`)
    }
    return true;
}
