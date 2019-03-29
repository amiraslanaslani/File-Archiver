const baseModel = require('./baseModel.js');
const dialogs = require('../dialogs.js');

exports.add = function(passed_name, passed_description, passed_filename, passed_tags, using_path){

    let callback = (id) => {
        for(let tag_name in passed_tags){
            baseModel.addToDatabase('files_tags',{
                file_id: id,
                tag: passed_tags[tag_name]
            }, null);
        }
    };

    let using_path_int = using_path ? 1 : 0;

    baseModel.addToDatabase('files', {
        name: passed_name,
        description: passed_description,
        file_name: passed_filename,
        using_path: using_path_int
    }, callback);
}

exports.loadFilesFromTagAndSearchString = function(tags = [], search = '', callback = () => {}){
    let whereQuery = '';
    if(search != ''){
        whereQuery = ` AND name LIKE '%${search}%' `
    }

    for(let tagId in tags){
        let tag = tags[tagId];
        whereQuery += `
        AND id IN (
            SELECT file_id
            FROM files_tags
            WHERE tag = '${tag}'
        ) 
        `;
    }

    let query = `SELECT * 
                 FROM files
                 WHERE 1 ${whereQuery}`; //TODO add limit and pagination

    baseModel.db.all(query, [], (err, rows) => {
        if(err){
            dialogs.openErrorDialog(err);
        }
        else{
            callback(rows)
        }
    });
}

exports.loadTagsList = function(callback){
    let query = "SELECT DISTINCT tag FROM files_tags";
    baseModel.db.all(query, [], (err, rows) => {
        if(err){
            dialogs.openErrorDialog(err);
        }
        else{
            callback(rows)
        }
    });
}

exports.loadTagsListWithFileID = function(fileID, callback){
    let query = "SELECT DISTINCT tag FROM files_tags WHERE file_id = ?";
    baseModel.db.all(query, [fileID], (err, rows) => {
        if(err){
            dialogs.openErrorDialog(err);
        }
        else{
            callback(rows)
        }
    });
}

exports.loadWithID = function(id, callback){
    baseModel.loadWithID('files', id, callback);
}

exports.load = function(){
    
}
