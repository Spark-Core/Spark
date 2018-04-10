module.exports = class DisableCache {

    constructor(initial) {
        this.commands = [];
        this.observers = [];
        this.engines = [];
        this.snippets = [];
        this.permissions = [];
        this.events = [];

        if (initial.commands && initial.commands.length > 0) {
            initial.commands.forEach(i => this.add("commands", i))
        }
        if (initial.observers && initial.observers.length > 0) {
            initial.observers.forEach(i => this.add("observers", i))
        }
        if (initial.engines && initial.engines.length > 0) {
            initial.engines.forEach(i => this.add("engines", i))
        }
        if (initial.events && initial.events.length > 0) {
            initial.events.forEach(i => this.add("events", i))
        }
        if (initial.permissions && initial.permissions.length > 0) {
            initial.permissions.forEach(i => this.add("permissions", i))
        }
        if (initial.snippets && initial.snippets.length > 0) {
            initial.snippets.forEach(i => this.add("snippets", i))
        }
    }

    has(type, name) {
        return this[type].indexOf(name) != -1
    }

    add(type, name) {
        this[type].push(name)
    }

    remove(type, name) {
        var nr = this[type].indexOf(name)
        if (nr != -1) {
            this[type].splice(nr, 1)
        }
    }
}
