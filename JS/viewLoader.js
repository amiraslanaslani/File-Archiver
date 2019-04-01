const path = require('path');
const fs = require("fs");

function get_view_file_path(file_name){
    return path.normalize(
        path.join(
            __dirname, 
            '../View/',
            file_name
        )
    );
}

exports.load = function(file_name, params = []){
    let file_content = fs.readFileSync(
        get_view_file_path(file_name)
    ).toString();

    let keys = Object.keys(params);
    for(let i in keys){
        let key = keys[i];
        let replaceThis = `{{${key.trim()}}}`;
        let replaceWith = params[key];
        
        file_content = file_content.replace(
            new RegExp(replaceThis, 'g'),
            replaceWith
        );
    }
    
    return file_content;
}