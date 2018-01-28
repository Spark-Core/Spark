/* eslint class-methods-use-this: ["error", { "exceptMethods": ["filter"] }] */

module.exports = class DataStore extends Map {

    filter(func) {
        const data = new DataStore()
        this.forEach((value, key) => {
            if (func(value, key)) {data.set(key, value)}
        })
        return data
    }

    map(func) {
        const array = new Array(this.size);
        let nr = 0;
        this.forEach((value, key) => {
            array[nr] = func(value, key)
            nr = nr + 1
        })
        return array
    }




}
