/* eslint no-console: 0 */
exports.name = "checkUpdate";
// Check update every every hour
exports.time = 3600000;
// Check on boot
exports.delay = 0;

exports.function = function(client) {
    client.data.util.checkUpdate(client.data.version).then(update => {
        console.log(update)
    }).catch(err => {
        console.warn(err)
    })
}
