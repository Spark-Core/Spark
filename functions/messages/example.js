var Spark = require("../../")
const MF = Spark.mf("example")

MF.setType("commands")

MF.code = (client, message) => {
    message.channel.send("test")
    return true;
}

module.exports = MF;
