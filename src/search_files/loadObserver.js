const DataStore = require("./../dataStore.js")
module.exports = async function(data, location) {
    if (!data.dataStore) {
        data.dataStore = {}
    }
    if (!data.dataStore.functions) {
        data.dataStore.functions = {};
    }
    data.dataStore.functions.observer = new DataStore();
    var temp = await data.searchInDirectories(location);
    var observer = [];
    temp.forEach(i => {
        try {
            var temp = require(i)
            observer.push({
                observer: temp,
                location: i
            })
        } catch (e) {
            console.error(`${i} | Error while loading observer: \n ${e}`)
        }

    })

    observer.forEach(i => {
        var {observer} = i
        if (observer.constructor.name !== "Observer") {
            console.warn(`${i.location} | Error while loading observer: \n File is not an Observer class | See https://discordspark.com/documentation/observers for more info.`)
            i = null;
            return;
        }
        if (typeof observer.type != "string" || ![
                "message",
                "command",
                "all"
            ].includes(observer.type)) {
            observer.type = "all"
        }
        if (typeof observer.code != "function") {
            console.warn(`${i.location} | Error while loading observer: \n No code specified. | see https://discordspark.com/documentation/observers for more info.`)
            i = null;
            // add return if more checks are added.
        }

    })
    observer = observer.filter(i => {
        return i != null
    })
    observer.forEach(i => {
        if (!data.dataStore.functions.observer.has(i.observer.name.toLowerCase())) {
            data.dataStore.functions.observer.set(i.observer.name.toLowerCase(), i)
        }
    })
    return observer
}
