const Spark = require("../")
const Permission = Spark.permission("Owner", {level: 10})
Permission.code = (client, message) => {
    if (client.config.ownerID !== message.author.id) {
        return true
    }
    return false;

}

module.exports = Permission
