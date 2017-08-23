module.exports = function(type, dir, local){
return new Promise(function(resolve, reject) {

switch (type){
    case "cmds":
    loadcommands(dir, local).then((commanddata) => {resolve(commanddata)}).catch((err) => reject(err));
    break;
    case "messages":
    messages(dir, local).then(() => {resolve(messagedata)}).catch(err => reject(err))
}






});
}


function commands(location){
    return new Promise(function(resolve, reject) {

fs.readdir(location + "/commands", function(err, results){
if (err){return reject(err)}
var results = results.map(i => (location + "/commands/" + i)).filter((i) => {return i.endsWith(".js")})
var data = {commands: new map() , names: []}
var number = 0;
results.forEach((path, num) => {
    number  = number + 1
    var mod = require.resolve(path);
     if (mod && ((mod = require.cache[mod]) !== undefined)){
         delete require.cache[require.resolve(path)]
     }
var temp = require(path);
if (typeof temp != 'object'){
    console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: command_no_object")
return done(number, num)
}
else if (temp.name == null || typeof temp.name != "string"){
    console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: invalid_or_no_name")
return done(number, num)
} else if (temp.aliases == null || typeof temp.aliases.constructor != Array){
    temp.aliases = []
}

data.names.set(temp.name)
data.commands.set(temp)
return done(number, num)
})
function done(number, num){
    if (number == num){return resolve(data)}
}
})
})
}


function loadcommands(dir, local){
commands(dir).then((data) => {
commands(local).then(() => {

})
})
}
