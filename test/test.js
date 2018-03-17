const Spark = require("../")
const { SearchLoader } = require("../src/search.js")
const DataStore = require("../src/dataStore.js")
const { expect } = require("chai")

describe('Searching & loading files', async function() {
    let loader = new SearchLoader({ options: {} })
    let commands;
    describe("Commands", function() {
        it('Loads the commands', async function() {
            commands = await loader.loadCommands(loader, loader.clientLocations.commands)
        })
        it('Returns an Array', function() {
            expect(commands.constructor.name, "Command return class name").to.equal("Array")
        })
        it("Has the built-in commands loaded", function() {
            expect(commands, "Command files\n- about.js\n- ping.js").to.have.lengthOf(2);
        })
        it("Has a name, level and code property", function() {
            expect(commands[0].command).to.have.property("name")
            expect(commands[0].command).to.have.property("level")
            expect(commands[0].command).to.have.property("code")
        })
    })

    describe("Permissions", function() {
        it('Loads the permissions', async function() {
            permissions = await loader.loadPermissions(loader, loader.clientLocations.permissions)
        })
        it('Returns an Array', function() {
            expect(permissions.constructor.name, "Permission return class name").to.equal("Array")
        })
        it("Has the built-in permissions loaded", function() {
            expect(permissions, "Permission files\n- member.js").to.have.lengthOf(1);

        })
        it("Has a name, level and code property", function() {
            expect(permissions[0].permission).to.have.property("name")
            expect(permissions[0].permission).to.have.property("level")
            expect(permissions[0].permission).to.have.property("code")
        })
    })

    describe("Boot Functions", function() {
        it('Loads the boot functions', async function() {
            bf = await loader.loadBF(loader, loader.clientLocations.bootFunctions)
        })
        it('Returns an Array', function() {
            expect(bf.constructor.name, "BootFunction return class name").to.equal("Array")
        })
        it("Has the built-in boot functions loaded", function() {
            expect(permissions, "boot function files\n-checkUpdate.js").to.have.lengthOf(1);
        })
        it("Has a name and code property", function() {
            expect(bf[0].bf).to.have.property("name")
            expect(bf[0].bf).to.have.property("code")
        })
    })

    describe("Message Functions", function() {
        it('Loads the message functions', async function() {
            observer = await loader.loadobserver(loader, loader.clientLocations.observers)
        })
        it('Returns an Array', function() {
            expect(observer.constructor.name, "MessageFunction return class name").to.equal("Array")
        })
        it("Has the built-in message functions loaded", function() {
            expect(permissions, "message function files\n-example.js").to.have.lengthOf(1);
        })
        it("Has a name and code property", function() {
            expect(observer[0].observer).to.have.property("name")
            expect(observer[0].observer).to.have.property("code")
        })
    })

    describe("Snippets", function() {
        it('Loads the snippets', async function() {
            snippets = await loader.loadSnippets(loader, loader.clientLocations.snippets)
        })
        it('Returns an Array', function() {
            expect(snippets.constructor.name, "Snippet return class name").to.equal("Array")
        })
        it("Has the built-in Snippet loaded", function() {
            expect(snippets, "snippet files\n-example.js").to.have.lengthOf(1);
        })
        it("Has a name and code property", function() {
            expect(snippets[0].snippet).to.have.property("name")
            expect(snippets[0].snippet).to.have.property("code")
        })
    })

    describe("Events", function() {
        it('Loads the events', async function() {
            events = await loader.loadEvents(loader, loader.clientLocations.events)
        })
        it('Returns an Array', function() {
            expect(events.constructor.name, "Event return class name").to.equal("Array")
        })
        it("Has the built-in Event loaded", function() {
            expect(snippets, "event files\n-example.js").to.have.lengthOf(1);
        })
        it("Has a name, event and code property", function() {
            expect(events[0].event).to.have.property("name")
            expect(events[0].event).to.have.property("event")
            expect(events[0].event).to.have.property("code")
        })
    })
})

describe("Data collecting and processing", function() {
    describe("DataStore", function() {

        var data = [{ key: "1", value: 1 }, { key: "2", value: 2 }, { key: "3", value: 3 }]
        var datastore = new DataStore();
        it('Creates and adds data to the dataStore', function() {
            data.forEach(function(i) {
                datastore.set(i.key, i.value)
            })
        })

        it('Filter method is successful', function() {
            expect(datastore.filter(function(i) {
                return (i > 2)
            }).size).to.equal(1)
        })
        it('map method is successful', function() {
            expect(datastore.map(function(i, n) {
                i + - +n
            })).to.have.lengthOf(3)
        })
    })
})