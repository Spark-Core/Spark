var Spark = require("../../")
const BF = Spark.bf("checkUpdate")
BF.code = (client) => {
    client.data.util.checkUpdate(client.data.version).then(update => {
        console.log(update)
    }).catch(err => {
        console.warn(err)
    })
}

BF.time = 0;
BF.delay = 0;

module.exports = BF;
