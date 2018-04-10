const Spark = require("../")
const Permission = Spark.permission("Member", {level: 0})
Permission.code = () => {

    return false;
}

module.exports = Permission
