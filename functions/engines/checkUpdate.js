/* eslint prefer-destructuring: 0*/
var Spark = require("../../")
var fs = require("fs-extra")
var path = require("path")
var sc = require("socket.io-client")
var socket = null;

const request = require("request-promise")
const Engine = Spark.engine("checkUpdate")
Engine.code = (client) => {
    if (!client.config.authURL || typeof client.config.authURL != "string") {
        client.config.authURL = "https://auth.discordspark.tk"
    }
    try {
        fs.readFile(path.join(require.main.filename.replace(/\\\w*.js/g, ""), "data.spark"), "utf8").then((data) => {
            client.config.Auth = parseConfig(data)
            connect(client)
        }).catch(() => {
            connect(client)
        })
    } catch (e) {
        if (!client.authErrors) {
            client.authErrors = []
        }
        client.authErrors.push(e)
    }
}

async function connect(client) {
    try {
        await request.get(client.config.authURL, {timeout: 5000})
    } catch (e) {
        return;
    }
    if (client.config.Auth) {
        socket = sc(client.config.authURL, {query: {id: client.config.Auth.id, key: client.config.Auth.key}});
    } else {
        var user = null;
        try {
            user = await client.fetchApplication()
            if (!user || !user.owner) {throw Error("No owner found")}

        } catch (e) {
            return;
            // probably not a Discord bot but a user/selfbot
        }
        socket = sc(client.config.authURL, {query: {register: true, version: client.version, ownerid: user.owner.id, botid: client.user.id}})
        socket.on("register-status", function(data) {
            if (data.status == 0) {
                register(data)
            } else if (data.status == 1) {
                socket = sc(client.config.authURL, {query: {id: client.config.Auth.id, key: client.config.Auth.key}});
            } else if (data.status == 2) {
                return console.log("Authentication data is incomplete | See the faq on the docs on how to fix this.");
            } else {
                return console.log(`There is an unknown issue with registering on the auth system | Code: ${data.status} | See the faq on the docs on how to fix this.`);
            }
        })
    }

    socket.on("connect", function() {
        console.log("Remote connection established, authenticating")
    });
    socket.on("Authentication", (data) => {
        if (data.status == 0) {
            socket.on("data-ping", () => {
                var shard = null
                if (client.shard) {
                    shard = `${client.shard.id} / ${client.shard.count}`;
                }
                socket.emit("data-pong", [
                    client.guilds.size,
                    client.uptime,
                    shard
                ])
            })
        } else if (data.status == 0) {
            console.log(data)
        } else if (data.status == 1) {
            console.error("Your id / key is incorrect / does noet exist | See the faq on the docs for more information")
        } else if (data.status == 2) {
            console.error("There was not enough data to log you in | See the faq on the docs for information.")
        } else {
            console.log(`There was an unknown issue with logging you in on the auth system | Code ${data.status} | See the faq on the docs for more information.`)
        }
    })

}


const placeholder = Spark.engine("checkUpdate")
placeholder.code = () => {
    Spark.engine("checkUpdate")
}
module.exports = placeholder;

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



async function register(data) {
    try {
        await fs.writeFile(path.join(require.main.filename.replace(/\\\w*.js/g, ""), "data.spark"), `!>> Please do not remove this file.\nid: ${data.id}\nkey: ${data.key}`)
    } catch (e) {
        console.error(e)
    }
}
