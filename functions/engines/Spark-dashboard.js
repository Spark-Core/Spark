/* eslint prefer-destructuring: 0*/
var Spark = require("../../")
const io = require("socket.io-client")
const Engine = Spark.engine("Spark-dashboard")
Engine.code = (client) => {
    if (!client.config.apiKey) {
        return
    }
    client.socket = io("https://dashboard.discordspark.com/", {query: {token: client.config.apiKey}})
    client.socket.on("connect", function() {
        console.log("Successfully authenticated with the dashboard.");
    }).on("disconnect", function() {
        console.log("disconnected from the dashboard.");
    })

    process.on("uncaughtException", function(err) {
        client.socket.emit("error_report", new Date(), err);
        throw err
    });
}
Engine.export(module)
