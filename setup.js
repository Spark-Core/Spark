var fs = require("fs")
const path = require("path");
var util = require("./src/util.js")
module.exports = function(config, local, reload) {
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
                        return next(data, local, reload).then(data => resolve(data)).catch(err => reject(err))
                    }).catch(err => {
                        return reject(err)
                    })
                })
            } else {

                util.load("cmds", __dirname, reload).then((data) => {
                    return next(data, local, reload).then(data => resolve(data)).catch(err => reject(err))
                }).catch(err => {
                    return reject(err)
                })
            }
        });

    });
}


function next(commands, local, reload) {
    return new Promise(function(resolve, reject) {

        var data = {}
        data.commands = commands

        fs.access(path.resolve(local, "functions"), fs.constants.R_OK, (err) => {
            if (err) {

                fs.mkdir(path.resolve(local, "functions"), function() {

                    functions(data, local, reload).then((functiondata) => {
                        data.functions = functiondata
                        resolve(data)
                    }).catch(err => reject(err))
                })
            } else {
                functions(data, local, reload).then((functiondata) => {
                    data.functions = functiondata
                    resolve(data)
                }).catch(err => reject(err))


            }
        });
    });

}



function functions(data, local, reload) {

    return new Promise(function(resolve, reject) {
        var types = ["messages"]

        function done(data) {
            if (Object.keys(data).length === 3) {
                return true
            }

            /* LENGTH NEEDS TO BE CHANGED WHEN NEW FUNCTIONS ARE ADDED! */
        }
        types.forEach(i => {
            fs.access(path.resolve(local, "functions/" + i), fs.constants.R_OK, (err) => {
                if (err) {
                    fs.mkdir(path.resolve(local, "functions/" + i), function(err) {
                        if (err) {
                            return reject(err)
                        }
                        util.load("functions", __dirname, reload).then((data) => {
                            if (done(data) == true) {
                                resolve(data)
                            }
                        }).catch(err => {
                            return reject(err)
                        })

                    })
                } else {
                    util.load("functions", __dirname, reload).then((data) => {

                        if (done(data) == true) {
                            return resolve(data)
                        }
                    }).catch(err => {
                        return reject(err)
                    })
                }
            });
        })
    });
}
