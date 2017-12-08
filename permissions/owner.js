exports.level = 10
exports.filter = (client, message) => {
    if(message.author.id == client.config.owner_id){return false}
    return true
}
