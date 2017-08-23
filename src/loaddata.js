var fs = require("fs")
module.exports = function(type, dir){
return new Promise(function(resolve, reject) {
var local = require('path').dirname(require.main.filename)
switch (type){
    case "cmds":
    loadcommands(dir, local).then((commanddata) => {resolve(commanddata)}).catch((err) => reject(err));
    break;
//    case "messages":
//    messages(dir, local).then(() => {resolve(messagedata)}).catch(err => reject(err));
//    break;
// IDEA: To be done!
}






});
}


function commands(location){

    return new Promise(function(resolve, reject) {
fs.readdir(location + "/commands", function(err, results){
if (err){console.log(location); return reject(err)}
var results = results.map(i => (location + "/commands/" + i)).filter((i) => {return i.endsWith(".js")})
var data = {commands: new Map() , names: [], aliases: new Map()}
if (results.length == 0){return resolve(data)}
var number = 0;
results.forEach((path, num) => {

    number  = number + 1
    var mod = require.resolve(path);
     if (mod && ((mod = require.cache[mod]) !== undefined)){
         delete require.cache[require.resolve(path)]
     }
var temp = require(path);
if (temp.name != null && typeof temp.name == "string"){
    temp.name = temp.name.toLowerCase()

} if (typeof temp != 'object'){
    console.warn(path + "  -- File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: command_no_object")
return done(number, num)

} else if (temp.name == null || typeof temp.name != "string"){
    console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: invalid_or_no_name")
return done(number, num)

} else if (temp.name.includes(" ")) {
    console.warn(path + "  -  File has an error with it's name, command names can't have spaces. Go to <pagelink> to learn more on how to set up commands. | code: space_in_command_name")
    return done(number, num)

} else if(data.commands.has(temp.name)){
    console.warn(path + " -- This file has the same name as: " +  data.commands.get(temp.name).path +" | code: duplicate_file_name")
    return done(number, num)

}   else if (temp.command == null || typeof temp.command != 'function'){
    console.warn(path + "  -  File isn't set up correctly, go to <pagelink> to learn more on how to set up commands. | code: no_command_function_set")
return done(number, num)

} if (temp.aliases == null || temp.aliases.constructor != Array){
    temp.aliases = []

}
temp.path = path
data.names.push(temp.name)
data.commands.set(temp)
aliasnumber = 0
if (temp.aliases.length == 0){
    return done(number, num)
}
temp.aliases.forEach((i, num) => {
aliasnumber = aliasnumber + 1
data.aliases.set(i, temp.name)
if (aliasnumber == num){
    return done(number, num)
}
})
})
function done(number, num){
    number = number - 1
    if (number == num){return resolve(data)}
}
})
})
}


function loadcommands(dir, local){
    return new Promise(function(resolve, reject) {
commands(dir).then((data) => {
if (dir == local){return resolve(data)}
commands(local).then((localdata) => {
    var number = 0;
data.names.forEach(function(i, index, object){
    if (localdata.names.includes(i)){
data.commands.delete(i)
    }else{
        localdata.commands.set(i, data.commands[index])
    }
    number  = number + 1;
    if (number == (index + 1)){return resolve(localdata)}
})



}).catch((err) => {reject(err)})
}).catch((err) => {reject(err)})
});
}
