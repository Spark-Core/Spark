const path = require("path");
const util = require("./util");
module.exports = function(type, dir, reload) {
    return new Promise(function(resolve, reject) {
        var local = path.dirname(require.main.filename)
        switch (type) {
            case "cmds":
                util.loadCommands(dir, local, reload).then((commanddata) => {
                    resolve(commanddata)
                }).catch((err) => reject(err));
                break;
            case "functions":
                util.loadFunctions(dir, local, reload).then((functiondata) => {
                    resolve(functiondata)
                }).catch((err) => reject(err));
                break;
        }




    });
}
