const Spark = require("../../");
const Snippet = Spark.snippet("example")

Snippet.code = () => {
    console.log("This is an example snippet, you can use this like a global function throughout your entire code.")
}

module.exports = Snippet;
