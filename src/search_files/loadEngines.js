const DataStore = require("./../dataStore.js")
module.exports = async function(data, location) {
    if (!data.dataStore) {data.dataStore = {}}
    if (!data.dataStore.functions) {
        data.dataStore.functions = {};
    }
    data.dataStore.functions.engines = new DataStore();
    var temp = await data.searchInDirectories(location);
    var engines = [];
    temp.forEach(i => {
        try {
            var temp = require(i)
            engines.push({engine: temp, location: i})
        } catch (e) {
            console.error(`${i} | Error while loading engine: \n ${e}`)
        }
    })

    engines.forEach(i => {
        var {engine} = i
        if (engine.constructor.name !== "Engine") {
            console.warn(`${i.location} | Error while loading engine: \n File is not an engine class | See https://discordspark.tk/docs/engine for more info.`)
            i = null;
            return;
        }
        if (typeof engine.time != "number" || engine.time < 0) {
            engine.time = 0
        }
        if (typeof engine.delay != "number" || engine.delay < 0) {
            engine.delay = 0
        }
        if (typeof engine.code != "function") {
            console.warn(`${i.location} | Error while loading engine: \n No code specified. | see https://discordspark.tk/docs/engine for more info.`)
            i = null;
            // add return if more checks are added.
        }

    })
    engines = engines.filter(i => {
        return i != null
    })
    engines.forEach(i => {
        if (!data.dataStore.functions.engines.has(i.engine.name.toLowerCase())) {
            data.dataStore.functions.engines.set(i.engine.name.toLowerCase(), i)
        }
    })
    return engines;
}
