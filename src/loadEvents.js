/* eslint no-console: 0 */
var fs = require("fs")
var path = require("path");
module.exports = function(dir, location, reload) {
    return new Promise(function(resolve, reject) {
        loadevent(dir, reload).then(data => {
            if (dir == location) {
                return resolve(data)
            }
            loadevent(location, reload).then(localdata => {
                data.names.forEach(function(i, index) {
                    if (!localdata.names.includes(i)) {
                        localdata.events.set(i, data.events.get(i))
                    }
                    if ((data.events.size - 1) === index) {
                        if (reload) {
                            localdata.issues = localdata.issues + data.issues
                        }
                        return resolve(localdata)
                    }
                })
            }).catch(e => reject(e))
        }).catch(e => reject(e))
    })
}

function loadevent(location, reload) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path.resolve(location, "events/"), function(err, results) {
            if (err) {
                fs.mkdir(path.resolve(location, "events/"), function(err) {
                    if (err) {
                        return reject(err)
                    }
                    module.exports(location, reload).then((data) => resolve(data)).catch(err => reject(err))
                })
            }
            if (!err) {
                results = results.map(i => (path.resolve(location, "events/" + i))).filter((i) => {
                    return i.endsWith(".js")
                })
                var data = {
                    events: new Map(),
                    names: [],
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
                    if (typeof temp != "object") {
                        console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up events. | code: no_object")
                        return done(number, num, reload)
                    } else if (temp.name === null || typeof temp.name != "string") {
                        console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up events. | code: invalid_or_no_name")
                        return done(number, num, reload)
                    } else if (temp.event === null || typeof temp.event != "string") {
                        console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up events. | code: invalid_or_no_event")
                        return done(number, num, reload)
                    } else if (temp.function == null || typeof temp.function != "function") {
                        console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up events. | code: no_function_setup")
                        return done(number, num, reload)
                    }
                    if (typeof temp.system != "boolean" || temp.system != true) {
                        delete temp.system;
                    }
                    data.events.set(temp.name, temp)
                    data.names.push(temp.name)
                    return done(number, num)

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
            }
        })
    });
}
