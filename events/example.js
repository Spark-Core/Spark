const Spark = require("../");
const Event = Spark.event("example")

Event.event = "debug";

var debug = false;
Event.code = (Client, data) => {
  if (debug) {console.log(data)}
}

module.exports = Event;
