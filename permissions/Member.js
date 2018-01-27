const Spark = require("C:\\code\\spark\\Spark")
const Permission = Spark.permission("Member", {level: 0})
Permission.code = () => {

    return false;
}

module.exports = Permission
