/* eslint no-console: 0 */
/* eslint complexity: ["error", 25]*/
var fs = require("fs")
var path = require("path");
module.exports = function(dir, local, reload) {
    return new Promise(function(resolve, reject) {
        commands(dir, reload).then((data) => {
            if (dir === local) {
                return resolve(data)
            }
            commands(local, reload).then((localdata) => {

                data.names.forEach(function(i, index) {
                    if (localdata.names.includes(i)) {
                        data.commands.delete(i)
                    } else {
                        localdata.commands.set(i, data.commands.get(i))
                    }
                    if ((data.names.length - 1) === index) {
                        if (reload) {
                            localdata.issues = localdata.issues + data.issues
                        }
                        return resolve(localdata)
                    }
                })



            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            reject(err)
        })
    });
}

function commands(location, reload) {

    return new Promise(function(resolve, reject) {
        fs.readdir(path.resolve(location, "commands"), function(err, results) {
            if (err) {
                return reject(err)
            }
            results = results.map(i => (location + "/commands/" + i)).filter((i) => {
                return i.endsWith(".js")
            })
            var data = {
                commands: new Map(),
                names: [],
                aliases: new Map(),
                issues: 0
            }
            if (results.length === 0) {
                return resolve(data)
            }
            var number = 0;
            results.forEach((path, num) => {
                number = number + 1
                var mod = require.resolve(path);
                if (mod !== undefined && (require.cache[mod] !== undefined)) {
                    delete require.cache[require.resolve(path)]
                }
                var temp = require(path);
                // komada command support.
                if (temp.komada != null && temp.komada == true) {
                    if (temp.conf != null) {
                        if (temp.conf.aliases != null) {
                            temp.aliases = temp.conf.aliases
                        }
                    }
                    if (temp.help === null) {
                        console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: komada_no_help")
                        return done(number, num, reload)

                    }
                    if (temp.help.name === null) {
                        console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: komada_no_help_name")
                        return done(number, num, reload)

                    }
                    temp.name = temp.help.name.toLowerCase()

                    if (temp.run != null && typeof temp.run == "function") {
                        temp.command = temp.run
                    } else {
                        console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: komada_no_run_function")
                        return done(number, num, reload)

                    }
                }
                // end komada command support.
                if (temp.name != null && typeof temp.name === "string") {
                    temp.name = temp.name.toLowerCase()

                }
                if (typeof temp != "object") {
                    console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: command_no_object")
                    return done(number, num, reload)

                } else if (temp.name === null || typeof temp.name != "string") {
                    console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: invalid_or_no_name")
                    return done(number, num, reload)

                } else if (temp.name.includes(" ")) {
                    console.warn(path + "  -  File has an error with it's name, command names can't have spaces. Go to <pagelink> to learn more on how to set up commands. | code: space_in_command_name")
                    return done(number, num, reload)

                } else if (data.commands.has(temp.name)) {
                    console.warn(path + " -- This file has the same name as: " + data.commands.get(temp.name).path + " | code: duplicate_file_name")
                    return done(number, num, reload)

                } else if (temp.command === null || typeof temp.command != "function") {
                    console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: no_command_function_set")
                    return done(number, num, reload)

                }
                if (temp.aliases === null || temp.aliases === undefined) {
                    temp.aliases = []

                } else if (temp.aliases.constructor != Array) {
                    temp.aliases = []
                }

                if (typeof temp.level != "number") {
                    temp.level = 0
                }
                temp.path = path
                data.names.push(temp.name)
                data.commands.set(temp.name, temp)
                var aliasnumber = 0
                if (temp.aliases.length === 0) {
                    return done(number, num)
                }
                temp.aliases.forEach((i, num) => {
                    aliasnumber = aliasnumber + 1
                    i = i.toLowerCase();
                    data.aliases.set(i, temp.name)
                    if (temp.aliases.length === (num + 1)) {
                        return done(number, num)
                    }
                })
            })

            function done(number, num, reload) {
                if (reload) {
                    data.issues = data.issues + 1
                }
                number = number - 1
                if (number === num) {
                    return resolve(data)
                }
            }
        })
    })
}
