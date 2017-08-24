module.exports = function(fs, config, local) {
    var util = require("./src/util.js")
    const path = require("path");
    return new Promise(function(resolve, reject) {
        if (parseInt(process.version.charAt(1) < 7)) {
            return reject("You need to update your node version to Node 7 or higher, go to https://nodejs.org/en/download/ for the latest versions.")
        }
        if (typeof config != "object") {
            return reject("You forgot to add your config, see the github repo for instructions on how to set this bot up.")
        }
        if (config.token === null) {
            return reject("You haven't set up your config correctly, please add your token in the config object.")
        }
        if (config.prefix === null) {
            return reject("You haven't set up your config correctly, please add your prefix in the config object.")
        }
        fs.access(path.resolve(local, "commands"), fs.constants.R_OK, (err) => {
            if (err) {

                fs.mkdir(path.resolve(local, "commands"), function() {
                    util.load("cmds", __dirname).then((data) => {
                        return resolve(data)
                    }).catch(err => {
                        return reject(err)
                    })
                })
            } else {

                util.load("cmds", __dirname).then((data) => {
                    return resolve(data)
                }).catch(err => {
                    return reject(err)
                })
            }
        });
    });
}
