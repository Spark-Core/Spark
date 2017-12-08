exports.name = "default"
exports.type = [
    "commands",
    "messages",
     "all"
 ];
exports.function = function(client, message, command) {
if (command){
//    "this is only available when using to handle a command"
return false
}
    // This will only be available if you're using this function to handle commands.
    // This is an example of a message function,
    // return false to continue to command, or return true to stop the command from executing.
}
