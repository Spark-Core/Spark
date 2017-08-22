module.exports = function(fs, config){
return new Promise(function(resolve, reject) {
if (parseInt(process.version.charAt(1) < 7)){return reject("You need to update your node version to Node 7 or higher, go to https://nodejs.org/en/download/ for the latest versions.")}
if (typeof config != "object"){return reject("You forgot to add your config, see the github repo for instructions on how to set this bot up.")}
if (config.token == null){return reject("You haven't set up your config correctly, please add your token in the config object.")}
if (config.prefix == null){return reject("You haven't set up your config correctly, please add your prefix in the config object.")}
fs.access(__dirname + '/commands', fs.constants.R_OK, (err) => {
if (err){
fs.mkdir(__dirname + "/commands", function(){
    loadcommands()
})
}
else{
    loadcommands()
}
});
function loadcommands(){
fs.readdir(__dirname + "/commands", function(err, results){
if (err){return reject("The program can't read your commands folder data, check the folder permissions.\n\n", err)}
resolve(results)
})

}



});
}
