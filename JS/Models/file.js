const baseModel = require('./baseModel.js');

exports.add = function(passed_name, passed_description, passed_filename, passed_tags){

    let callback = (id) => {
        for(let tag_name in passed_tags){
            baseModel.addToDatabase('files_tags',{
                file_id: id,
                tag: passed_tags[tag_name]
            }, null);
        }
    };

    baseModel.addToDatabase('files', {
        name: passed_name,
        description: passed_description,
        file_name: passed_filename
    }, callback);


}

exports.load = function(){
    let query = `SELECT * FROM files`;

    baseModel.db.all(query, [], (err, rows) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(rows);
        }
    });

    query = `SELECT * FROM files_tags`;

    baseModel.db.all(query, [], (err, rows) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(rows);
        }
    });
}
