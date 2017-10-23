exports.name = "getLevel"
exports.function = function(client, message){

if (message.author.id === client.config.owner_id){
    return 10
}
    return 0

}
