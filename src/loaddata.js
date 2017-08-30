/* eslint no-console: 0 */
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
                //    case "messages":
                //    messages(dir, local).then(() => {resolve(messagedata)}).catch(err => reject(err));
                //    break;
                // IDEA: To be done!
        }




    });
}
