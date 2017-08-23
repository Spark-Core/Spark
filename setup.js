module.exports = function(fs, config, local){
var util = require("./src/util.js")
return new Promise(function(resolve, reject) {
if (parseInt(process.version.charAt(1) < 7)){return reject("You need to update your node version to Node 7 or higher, go to https://nodejs.org/en/download/ for the latest versions.")}
if (typeof config != "object"){return reject("You forgot to add your config, see the github repo for instructions on how to set this bot up.")}
if (config.token == null){return reject("You haven't set up your config correctly, please add your token in the config object.")}
if (config.prefix == null){return reject("You haven't set up your config correctly, please add your prefix in the config object.")}
fs.access(local + '/commands', fs.constants.R_OK, (err) => {
if (err){
fs.mkdir(local + "/commands", function(){
    loadcommands()
})
}
else{
    loadcommands()
}
});



/*function loadcommands(){
    fs.readdir(__dirname + "/commands", function(err, results){
    if (err){return reject(err)}
    var results = results.map(i => (__dirname + "/commands/" + i))

fs.readdir(local+ "/commands", function(err, result){
if (err){return reject("The program can't read your commands folder data, check the folder permissions.\n\n", err)}
var result = result.map(i => (local + "/commands/" + i))

var number = 0;
results.forEach((name, num) => {
fs.readFile(name,'utf8', function(err, results){
    if (err){}
    else{
        console.log(results)
    }


number = number + 1;


if (number == num){resolve(results)}
})
})



})
})
}
*/


});
}
