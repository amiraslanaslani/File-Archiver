const dbLoader = require('../db.loader.js');
const dialogs = require('../dialogs.js');

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
            dialogs.openErrorDialog(err);
        }
        else{
            if(callback !== null){
                callback(this.lastID);
            }
        }
    });
}

exports.loadWithID = function(table, id, callback){
    let query = `SELECT * FROM ${table} WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if(err){
            dialogs.openErrorDialog(err);
        }
        else{
            callback(row);
        }
    });
}