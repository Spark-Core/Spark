const DataStore = require("./../dataStore.js")
module.exports = async function(data, location) {
    if (!data.dataStore) {data.dataStore = {}}
    if (!data.dataStore.functions) {
        data.dataStore.functions = {};
    }
    data.dataStore.functions.snippet = new DataStore();
    const temp = await data.searchInDirectories(location);
    let snippets = [];
    temp.forEach(i => {
        try {
            const temp = require(i)
            snippets.push({snippet: temp, location: i})
        } catch (e) {
            console.error(`${i} | Error while loading snippet: \n ${e}`)
        }

    })

    snippets.forEach(i => {
        const {snippet} = i
        if (snippet.constructor.name !== "Snippet") {
            console.warn(`${i.location} | Error while loading snippet: \n File is not a snippet class | See https://discordspark.com/documentation/snippets for more info.`)
            i = null;
            return;
        }
        if (typeof snippet.code != "function") {
            console.warn(`${i.location} | Error while loading snippet: \n No code specified. | see https://discordspark.com/documentation/snippets for more info.`)
            i = null;
        }

    })
    snippets = snippets.filter(i => {
        return i != null
    })
    snippets.forEach(i => {
        if (!data.dataStore.functions.snippet.has(i.snippet.name.toLowerCase())) {
            data.dataStore.functions.snippet.set(i.snippet.name.toLowerCase(), i)
        }
    })
    return snippets
}
