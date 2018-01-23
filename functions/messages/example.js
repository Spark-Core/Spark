var Spark = require("../../")
const MF = Spark.mf("example")

MF.setType("messages")

MF.code = (client, message) => {
    message.channel.send("test")
}

module.exports = MF;
