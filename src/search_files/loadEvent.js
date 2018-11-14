const DataStore = require("./../dataStore.js")
module.exports = async function(data, location) {
    if (!data.dataStore) {
        data.dataStore = {}
    }

    data.dataStore.events = new DataStore();
    const temp = await data.searchInDirectories(location);
    let events = [];
    temp.forEach(i => {
        try {
            const temp = require(i)
            events.push({
                event: temp,
                location: i
            })
        } catch (e) {
            console.error(`${i} | Error while loading event: \n ${e}`)
        }

    })

    events.forEach(function(i) {
        const {event} = i
        if (event.constructor.name !== "Event") {
            console.warn(`${i.location} | Error while loading event: \n File is not a event class | See https://discordspark.com/docs/events for more info.`)
            i = null;
        }
        if (typeof event.name != "string" || event.name.length < 1) {
            console.warn(`${i.location} | Error while loading event: \n No event name specified | See https://discordspark.com/documentation/events for more info.`)
            i = null;
        }
        if (typeof event.event != "string") {
            console.warn(`${i.location} | Error while loading event: \n No event specified | See https://discordspark.com/documentation/events for more info.`)
            i = null;
        }
        if (typeof event.code != "function") {
            console.warn(`${i.location} | Error while loading event: \n No code specified | See https://discordspark.com/documentation/events for more info.`)
            i = null;
        }

    })
    events = events.filter(i => {
        return i != null
    })
    events.forEach(i => {
        if (!data.dataStore.events.has(i.event.name.toLowerCase())) {
            data.dataStore.events.set(i.event.name.toLowerCase(), i)
        }
    })
    return events;
}
