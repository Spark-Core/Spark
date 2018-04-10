const DataStore = require("./../dataStore.js")
module.exports = async function(data, location) {
    if (!data.dataStore) {data.dataStore = {}}

    data.dataStore.permissions = new DataStore();
    var temp = await data.searchInDirectories(location);
    var permissions = [];
    temp.forEach(i => {
        try {
            var temp = require(i)
            permissions.push({permission: temp, location: i})
        } catch (e) {
            console.error(`${i} | Error while loading permission: \n ${e}`)
        }

    })

    permissions.forEach(i => {
        var {permission} = i
        if (permission.constructor.name !== "Permission") {
            console.warn(`${i.location} | Error while loading permission: \n File is not a permission class | See https://discordspark.com/documentation/permissions for more info.`)
            i = null;
            return;
        }
        if (typeof permission.level != "number") {
            console.warn(`${i.location} | Error while loading permission: \n No level specified | See https://discordspark.com/documentation/permissions for more info.`)
            i = null;
        }
        if (typeof permission.code != "function") {
            console.warn(`${i.location} | Error while loading permission: \n No code specified. | see https://discordspark.com/documentation/permissions for more info.`)
            i = null;
        }

    })
    permissions = permissions.filter(i => {
        return i != null
    })
    permissions.forEach(i => {
        if (!data.dataStore.permissions.has(i.permission.name.toLowerCase())) {
            data.dataStore.permissions.set(i.permission.name.toLowerCase(), i)
        }
    })
    return permissions;
}
