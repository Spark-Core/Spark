exports.name = "checkUpdate";
exports.time = 0;
exports.delay = 0;
exports.function = function(client){
    console.log(client.data.version)
    client.data.util.checkUpdate(client.data.version).then(update => {
        console.log(update)
    }).catch(err => {
        console.warn(err)
    })

}
