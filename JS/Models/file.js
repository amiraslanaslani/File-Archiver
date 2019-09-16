const baseModel = require('./baseModel.js');
const dialogs = require('../dialogs.js');

exports.add = function(passed_name, passed_description, passed_filename, passed_tags, using_path){

    let callback = (id) => {
        exports.addTags(id, passed_tags);
    };

    let using_path_int = using_path ? 1 : 0;

    baseModel.addToDatabase('files', {
        name: passed_name,
        description: passed_description,
        file_name: passed_filename,
        using_path: using_path_int
    }, callback);
}

exports.addTags = function(id, passed_tags){
    for(let tag_name in passed_tags){
        baseModel.addToDatabase('files_tags',{
            file_id: id,
            tag: passed_tags[tag_name]
        }, null);
    }
}

exports.addArrayTags = function(file_id, tags, callback){
    let tagsInMyStyle = [];
    for(let i in tags){
        let tag = tags[i];
        tagsInMyStyle.push({
            file_id,
            tag
        });
    }

    baseModel.addArrayToDatabase('files_tags', tagsInMyStyle, callback);
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
            rows = rows.map((tag) => {return tag.tag});
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
            rows = rows.map((tag) => {return tag.tag});
            callback(rows)
        }
    });
}

exports.removeTagsFromID = function(id, callback){
    let tag_query = "DELETE FROM files_tags WHERE file_id = ?";
    baseModel.db.run(tag_query, id, (err) => {
        if(err){
            dialogs.openErrorDialog(err);
        }
        else if(callback){
            callback();
        }
    });
}

exports.loadWithID = function(id, callback){
    baseModel.loadWithID('files', id, callback);
}

exports.removeFromID = function(id, callback){
    exports.removeTagsFromID(id, () => {
        let file_query = "DELETE FROM files WHERE id = ?";

        baseModel.db.run(file_query, id, (err) => {
            if(err){
                dialogs.openErrorDialog(err);
            }
            else if(callback){
                callback()
            }
        });
    });
}

exports.updateFile = function(id, updates, callback){
    baseModel.updateRow('files', id, updates, callback);
}

exports.load = function(){
    
}
