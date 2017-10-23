const request = require("request");
module.exports = function(version) {
    return new Promise(function(resolve, reject) {
        request("https://spark.a3c-bot.com/update?currentversion=" + version,
            function(error, response, body) {
                if (error) {
                    return reject("Sorry, There was a issue whilst checking for a update, try again later.")
                } else if (response.statusCode == 200) {
                    var data = JSON.parse(body)
                    if (data.update_required) {
                        var newversion = null;
                        if (version.includes("beta")) {
                            newversion = data.latest_beta
                        } else {
                            newversion = data.latest
                        }
                        return resolve("\nAn update is required, please type npm install sparkbots \nto install the latest version  ( v" + version + " --> v" + newversion + ")")
                    }
                }
            })
    });
}
