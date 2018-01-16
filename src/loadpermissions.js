var fs = require("fs")
var path = require("path")
var nr = 0
var old = null
module.exports = (dir, location) => {
return new Promise(function(resolve, reject) {

    fs.readdir(path.resolve(dir, "permissions"), function(err, results) {
    if (err){
        return reject(err)
    }
    load(dir, results).then(data => resolve(data)).catch(reject)
fs.readdir(path.resolve(location, "permissions"), function(err, results) {
    if (err) {
        fs.mkdir(path.resolve(location, "permissions"), function(err) {
            if (err) {
                return reject(err)
            }
            load(location,results).then((data) => resolve(data)).catch(reject)
        })
    }else{
        load(location,results).then((data) => resolve(data)).catch(reject)
    }



})
})



});
}



function done(data){
nr = nr + 1
if (nr == 1){
    old = data
}
if (nr == 2){
var array = data.concat(old).sort(sort);
nr = 0
old = null
return array
}
return null;
}

function sort(a,b) {
  if (a.level < b.level){
      return -1;
  }
  return 1;
}

function load(location, results){
    return new Promise(function(resolve) {
        var array = []

        if (!results || results.length == 0){
            var result = done(array)
            if (result){
                resolve(result)
            }
        }
        results.filter(i => {return i.endsWith(".js")}).forEach((i, n) => {
            i = require(path.resolve(location, "permissions/" + i))
            array.push(i)
            if (results.length == (n + 1)){
                var result = done(array)
                if (result){
                    resolve(result)
                }

            }
        })


    });
}
