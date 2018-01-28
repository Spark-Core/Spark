module.exports = async function(data, location) {
    if (!data.dataStore.functions) {
        data.dataStore.functions = {};
    }
    data.dataStore.functions.message = new Map();
    var temp = await data.searchInDirectories(location);
    var mf = [];
    temp.forEach(i => {
        try {
            var temp = require(i)
            mf.push({mf: temp, location: i})
        } catch (e) {
            console.error(`${i} | Error while loading message function: \n ${e}`)
        }

    })

    mf.forEach(i => {
        var {mf} = i
        if (mf.constructor.name !== "MF") {
            console.warn(`${i.location} | Error while loading message function: \n File is not a message function class | See https://discordspark.tk/docs/message_function for more info.`)
            i = null;
            return;
        }
        if (typeof mf.type != "string" || ![
                "messages",
                "commands",
                "all"
            ].includes(mf.type)) {
            mf.type = "all"
        }
        if (typeof mf.code != "function") {
            console.warn(`${i.location} | Error while loading message function: \n No code specified. | see https://discordspark.tk/docs/message_function for more info.`)
            i = null;
            // add return if more checks are added.
        }

    })
    mf = mf.filter(i => {
        return i != null
    })
    mf.forEach(i => {
        if (!data.dataStore.functions.message.has(i.mf.name.toLowerCase())) {
            data.dataStore.functions.message.set(i.mf.name.toLowerCase(), i)
        }
    })
}
