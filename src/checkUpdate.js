const request = require("request");
module.exports = function(edb) {
    return new Promise(function(resolve, reject) {
        request("https://easy-discord-bot.tk/update?currentversion=" + edb.version,
            function(error, response, body) {
                if (error) {
                    return reject("Sorry, There was a issue whilst checking for a update, try again later.")
                } else if (response.statusCode == 200) {
                    var data = JSON.parse(body)
                    if (data.update_required) {
                        var version = null;
                        if (edb.version.includes("beta")) {
                            version = data.latest_beta
                        } else {
                            version = data.latest
                        }

                        return resolve("\nAn update is required, please type npm install easy-discord-bot \nto install the latest version  ( v" + edb.version + " --> v" + version + ")")
                    }
                }


            })
    });
}
