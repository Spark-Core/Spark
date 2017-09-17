/* eslint no-console: 0 */
var fs = require("fs")
var path = require("path");
var snippetLoad = require("./snippetLoad.js")
module.exports = function(dir, local, reload) {
    return new Promise(function(resolve, reject) {
        var functions = {};
        messages(dir, local, reload).then(data => {
            functions.messages = data
            if (done(functions) == true) {
                resolve(functions)
            }
        }).catch(err => reject(err))
        bootFuncs(dir, local, reload).then(data => {
            functions.boot = data
            if (done(functions) == true) {
                resolve(functions)
            }
        }).catch(err => reject(err))
        snippetFuncs(dir, local, reload).then(data => {
            functions.snippets = data
            if (done(functions) == true) {
                resolve(functions)
            }
        }).catch(err => reject(err))
    })
}

function done(data) {
    if (Object.keys(data).length === 3) {
        return true
    }
}

function messages(dir, local, reload) {
    return new Promise(function(resolve, reject) {
        messagesLoad(dir, reload).then(data => {
            if (data == false) {
                return messages(dir, local, reload).then((data) => resolve(data)).catch(err => reject(err))
            }
            if (dir == local) {
                return resolve(data)
            }
            messagesLoad(local, reload).then(localdata => {
                if (localdata == false) {
                    return messages(dir, local, reload).then((data) => resolve(data)).catch(err => reject(err))
                }
                data.names.forEach(function(i, index) {
                    if (localdata.names.includes(i)) {
                        data.messagefuncs.delete(i)
                    } else {
                        localdata.messagefuncs.set(i, data.messagefuncs.get(i))
                    }
                    if ((data.messagefuncs.size - 1) === index) {
                        if (reload) {
                            localdata.issues = localdata.issues + data.issues
                        }
                        return resolve(localdata)
                    }
                })
            }).catch(err => reject(err))
        }).catch(err => reject(err))
    });
}

function bootFuncs(dir, local, reload) {
    return new Promise(function(resolve, reject) {
        bootLoad(dir, reload).then(data => {
            if (data == false) {
                return messages(dir, local, reload).then((data) => resolve(data)).catch(err => reject(err))
            }
            if (dir == local) {
                return resolve(data)
            }
            bootLoad(local, reload).then(localdata => {
                if (localdata == false) {
                    return messages(dir, local, reload).then((data) => resolve(data)).catch(err => reject(err))
                }
                data.names.forEach(function(i, index) {
                    if (localdata.names.includes(i)) {
                        data.bootfuncs.delete(i)
                    } else {
                        localdata.bootfuncs.set(i, data.bootfuncs.get(i))
                    }
                    if ((data.bootfuncs.size - 1) === index) {
                        if (reload) {
                            localdata.issues = localdata.issues + data.issues
                        }
                        return resolve(localdata)
                    }
                })
            }).catch(err => reject(err))
        }).catch(err => reject(err))
    });
}

function bootLoad(location, reload) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path.resolve(location, "functions/boot/"), function(err, results) {
            if (err) {
                fs.mkdir(path.resolve(location, "functions/boot/"), function(err) {
                    if (err) {
                        return reject(err)
                    }
                    bootLoad(location, reload).then((data) => resolve(data)).catch(err => reject(err))
                })
            }
            if (!err) {
                results = results.map(i => (path.resolve(location, "functions/boot/" + i))).filter((i) => {
                    return i.endsWith(".js")
                })
                var data = {
                    bootfuncs: new Map(),
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
                        console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up boot functions. | code: msgfunc_no_object")
                        return done(number, num, reload)
                    } else if (temp.name === null || typeof temp.name != "string") {
                        console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up boot functions. | code: invalid_or_no_name")
                        return done(number, num, reload)
                    } else if (temp.time == null || typeof temp.time != "number") {
                        temp.time = 0;
                    } else if (temp.delay == null || typeof temp.delay != "number") {
                        temp.delay = 0;
                    } else if (temp.function == null || typeof temp.function != "function") {
                        console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up boot functions. | code: no_function_setup")
                        return done(number, num, reload)
                    }
                    if (typeof temp.system != "boolean" || temp.system != true) {
                        delete temp.system;
                    }
                    data.bootfuncs.set(temp.name, temp)
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

function messagesLoad(location, reload) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path.resolve(location, "functions/messages/"), function(err, results) {
            if (err) {
                fs.mkdir(path.resolve(location, "functions/messages/"), function(err) {
                    if (err) {
                        return reject(err)
                    }
                    messagesLoad(location, reload).then((data) => resolve(data)).catch(err => reject(err))
                })
            }
            results = results.map(i => (path.resolve(location, "functions/messages/" + i))).filter((i) => {
                return i.endsWith(".js")
            })
            var data = {
                messagefuncs: new Map(),
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
                    console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up message functions. | code: msgfunc_no_object")
                    return done(number, num, reload)
                } else if (temp.name === null || typeof temp.name != "string") {
                    console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up message functions. | code: invalid_or_no_name")
                    return done(number, num, reload)

                } else if (temp.function == null || typeof temp.function != "function") {
                    console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up message functions. | code: no_function_setup")
                    return done(number, num, reload)
                }
                if (temp.type == null || temp.type.constructor != Array) {
                    temp.type = ["messages"]
                } else {
                    temp.type.forEach(i => {
                        i = i.toLowerCase()
                        if (i == "all" || i == "messages" || i == "commands") {
                            // empty block was the easiest thing i could think off :(
                        } else {
                            temp.type = ["messages"]
                        }
                    })
                }
                data.messagefuncs.set(temp.name, temp)
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
        })
    })
}

function snippetFuncs(dir, local, reload) {
    return new Promise(function(resolve, reject) {
        snippetLoad(dir, reload).then(data => {
            if (data == false) {
                return messages(dir, local, reload).then((data) => resolve(data)).catch(err => reject(err))
            }
            if (dir == local) {
                return resolve(data)
            }
            snippetLoad(local, reload).then(localdata => {
                if (localdata == false) {
                    return messages(dir, local, reload).then((data) => resolve(data)).catch(err => reject(err))
                }
                data.names.forEach(function(i, index) {
                    if (localdata.names.includes(i)) {
                        data.snippets.delete(i)
                    } else {
                        localdata.snippets.set(i, data.snippets.get(i))
                    }
                    if ((data.snippets.size - 1) === index) {
                        if (reload) {
                            localdata.issues = localdata.issues + data.issues
                        }
                        return resolve(localdata)
                    }
                })
            }).catch(err => reject(err))
        }).catch(err => reject(err))
    });
}
