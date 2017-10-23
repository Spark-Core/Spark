/* eslint no-console: 0 */
var fs = require("fs")
var path = require("path");
module.exports = function(location, reload) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path.resolve(location, "functions/snippets/"), function(err, results) {
            if (err) {
                fs.mkdir(path.resolve(location, "functions/snippets/"), function(err) {
                    if (err) {
                        return reject(err)
                    }
                    module.exports(location, reload).then((data) => resolve(data)).catch(err => reject(err))
                })
            }
            if (!err) {
                results = results.map(i => (path.resolve(location, "functions/snippets/" + i))).filter((i) => {
                    return i.endsWith(".js")
                })
                var data = {
                    snippets: new Map(),
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
                        console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up snippets. | code: no_object")
                        return done(number, num, reload)
                    } else if (temp.name === null || typeof temp.name != "string") {
                        console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up snippets. | code: invalid_or_no_name")
                        return done(number, num, reload)
                    } else if (temp.function == null || typeof temp.function != "function") {
                        console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up snippets. | code: no_function_setup")
                        return done(number, num, reload)
                    }
                    if (typeof temp.system != "boolean" || temp.system != true) {
                        delete temp.system;
                    }
                    data.snippets.set(temp.name, temp)
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
    })
}
