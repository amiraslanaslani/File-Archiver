const dbLoader = require('../db.loader.js');

var db = dbLoader.load();

exports.db = db;

exports.addToDatabase = function(tableName, data, callback) {
    let keys = Object.keys(data);
    let keysQuery = keys.join(',');

    let values = [];
    for(let key in keys){
        values.push('\'' + data[ keys[key] ] + '\'');
    }
    let valuesQuery = values.join(',');

    let query = `INSERT INTO ${tableName}
                 (${keysQuery})
                 VALUES
                 (${valuesQuery})`;

    db.run(query, function(err) {
        if(err){
            console.log(err);
        }
        else{
            if(callback !== null){
                callback(this.lastID);
            }
        }
    });
}
