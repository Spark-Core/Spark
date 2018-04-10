var DisableCache = require("./DisableCache.js")
var chalk = require("chalk")
module.exports = (options) => {
    if (typeof options != "object") {
        return console.log(`You are trying to start without ${chalk.red("a starting object")}.\nPlease read this article:\n${chalk.blue("https://discordspark.com/documentation/intro")}`)
    } else if (typeof options.token != "string") {
        return console.log(`You are trying to start without ${chalk.red("a valid token")}.\nPlease read this article:\n${chalk.blue("https://discordspark.com/documentation/intro")}`)
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
            return console.log(`You are trying to start without ${chalk.red("a valid prefix")}.\nPlease read this article:\n${chalk.blue("https://discordspark.com/documentation/intro")}`)
        }
        options.prefix = [options.prefix]
    } else if (options.prefix instanceof Array) {
        options.prefix.forEach(i => {
            if (i.includes(" ")) {
              return console.log(`You are trying to start without ${chalk.red("a valid prefix")}.\nPlease read this article:\n${chalk.blue("https://discordspark.com/documentation/intro")}`)
            }
        })
    } else {
      return console.log(`You are trying to start without ${chalk.red("a valid prefix")}.\nPlease read this article:\n${chalk.blue("https://discordspark.com/documentation/intro")}`)
    }
    if (typeof options.clientOptions != "object") {
        options.clientOptions = {}
    }
    return true;
}
