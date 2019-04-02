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
            if(callback){
                callback(this.lastID);
            }
        }
    });
}

exports.addArrayToDatabase = function(tableName, inData, callback) {
    if(inData.length < 1)
        return;

    let keys = Object.keys(inData[0]);
    let keysQuery = keys.join(',');

    let valuesQuery = [];
    for(let i in inData){
        let data = inData[i];
        valuesQuery.push('(' + getValuesQuery(keys, data) + ')');
    }
    valuesQuery = valuesQuery.join(', ');

    let query = `INSERT INTO ${tableName}
                 (${keysQuery})
                 VALUES
                 ${valuesQuery}`;

    db.run(query, function(err) {
        if(err){
            dialogs.openErrorDialog(err);
        }
        else{
            if(callback){
                callback(this.lastID);
            }
        }
    });
}

function getValuesQuery(keys, data) {
    let values = [];
    for(let key in keys){
        values.push('\'' + data[ keys[key] ] + '\'');
    }
    return values.join(',');
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

exports.updateRow = function(table, id, updates, callback){
    let set = [];
    let keys = Object.keys(updates);
    for(let i in keys){
        let key = keys[i];
        let value = updates[key];
        value = value.replace(/'/g, "\\'");
        set.push(`${key} = '${value}'`);
    }
    set = set.join(', ');

    let query = `
        UPDATE ${table}
        SET ${set}
        WHERE id = ${id}
    `;

    db.run(query, function(err) {
        if(err){
            dialogs.openErrorDialog(err);
        }
        else{
            if(callback){
                callback();
            }
        }
    });
}
