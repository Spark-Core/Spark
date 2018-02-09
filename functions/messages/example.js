var Spark = require("../../")
const MF = Spark.mf("example")

MF.setType("commands")

MF.code = () => {
    return false;
}

module.exports = MF;
