/* eslint no-process-exit: 0*/
var Spark = require("../")
const Command = Spark.command("reboot")

Command.addAlias("restart")
Command.setLevel(10)
Command.setDescription("Restart your bot.")

Command.code = async (client, message) => {
  await message.channel.send("Rebooting your bot...");
  process.exit();
}
module.exports = Command;
