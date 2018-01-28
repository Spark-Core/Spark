module.exports = async function(data, location) {
    if (!data.dataStore.functions) {
        data.dataStore.functions = {};
    }
    data.dataStore.functions.boot = new Map();
    var temp = await data.searchInDirectories(location);
    var bf = [];
    temp.forEach(i => {
        try {
            var temp = require(i)
            bf.push({bf: temp, location: i})
        } catch (e) {
            console.error(`${i} | Error while loading boot function: \n ${e}`)
        }

    })

    bf.forEach(i => {
        var {bf} = i
        if (bf.constructor.name !== "BF") {
            console.warn(`${i.location} | Error while loading boot function: \n File is not a boot function class | See https://discordspark.tk/docs/boot_function for more info.`)
            i = null;
            return;
        }
        if (typeof bf.time != "number") {
            bf.time = 0
        }
        if (typeof bf.delay != "number") {
            bf.delay = 0
        }
        if (typeof bf.code != "function") {
            console.warn(`${i.location} | Error while loading boot function: \n No code specified. | see https://discordspark.tk/docs/boot_function for more info.`)
            i = null;
            // add return if more checks are added.
        }

    })
    bf = bf.filter(i => {
        return i != null
    })
    bf.forEach(i => {
        if (!data.dataStore.functions.boot.has(i.bf.name.toLowerCase())) {
            data.dataStore.functions.boot.set(i.bf.name.toLowerCase(), i)
        }
    })
}
