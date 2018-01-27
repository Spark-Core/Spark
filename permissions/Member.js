const Spark = require("C:\\code\\spark\\Spark")
const Permission = Spark.permission("Member", { level: 0 })
Permission.code = (client, message) => {

    return false;
}