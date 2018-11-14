const Spark = require("../");
const Event = Spark.event("example")

Event.event = "debug";

const debug = false;
Event.code = (Client, data) => {
  if (debug) {console.log(data)}
}

module.exports = Event;
