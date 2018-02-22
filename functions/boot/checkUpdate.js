/* eslint prefer-destructuring: 0*/
var Spark = require("../../")
var fs = require("fs-extra")
var path = require("path")
const request = require("request-promise")
const BF = Spark.bf("checkUpdate")
BF.code = (client) => {
    if (!client.config.authURL || typeof client.config.authURL != "string") {
        client.config.authURL = "https://auth.discordspark.tk"
    }
    try {
        fs.readFile(path.join(require.main.filename.replace(/\\\w*.js/g, ""), "data.spark"), "utf8").then((data) => {
            client.config.Auth = parseConfig(data)
            checkConnection(client)
        }).catch(() => {
            register(client)
        })
    } catch (e) {
        if (!client.authErrors) {
            client.authErrors = []
        }
        client.authErrors.push(e)
    }

}

BF.time = 30000;
BF.delay = 0;

module.exports = BF;

function parseConfig(data) {
    data = data.replace(/!>>[ \w,.]*\n/g, "")
    var x = {}
    data.split("\n").forEach(i => {
        i = i.split(": ")
        if (!i[0]) {return}
        var o = {}
        o[i[0]] = i[1]
        x[i[0]] = i[1]
    })
    return x;
}

async function checkConnection(client) {

    try {
        var response = await request.post(client.config.authURL + "/update", {form: {ID: client.config.auth.ID, Secret: client.config.auth.Secret}, timeout: 10000})
        console.log(response)
    } catch (e) {
        if (!client.authErrors) {
            client.authErrors = []
        }
        client.authErrors.push(e)
    }
}

async function register(client) {
    try {
        var response = await request.get(client.config.authURL + "/register", {qs: {version: client.version}, json: true})
        if (typeof response != "object" || !response.key) {return}
        fs.writeFile(path.join(require.main.filename.replace(/\\\w*.js/g, ""), "data.spark"), `!>> Please do not remove this file.\nKey: ${response.key}`)
    } catch (e) {
        if (!client.authErrors) {
            client.authErrors = []
        }
        client.authErrors.push(e)
    }
}
