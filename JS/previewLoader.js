const path = require('path');
const fs = require('fs');

var pictures = [
    'jpg',
    'jpeg',
    'bmp',
    'gif',
    'png',
    'svg'
];

var videos = [
    'mkv',
    'avi',
    'mp4'
];

function linkDirector(file_name, isUsePath_int){
    let isUsePath = isUsePath_int == 1 ? true : false;

    if(isUsePath)
        return file_name;
        
    return path.normalize(
        path.join(
            __dirname, '../Files', file_name
        )
    );
}

exports.load = function(file){
    let format = path.extname(file.file_name).replace('.', "").toLowerCase();
    let link = linkDirector(file.file_name, file.using_path);

    // if(! fs.existsSync(link))
    //     return '';
    //TODO fix this

    let output = `<div id="openFileBtn" data-path="${link}" class="dark-inp light-inp">Open File</div>`;
    
    if(pictures.includes(format)){
        output += getPicturePreview(link);
    }

    if(pictures.includes(videos)){
        output += getVideoPreview(link);
    }

    return output;
}

function getPicturePreview(link) {
    
    return `
        <div id="picturePreview">
            <img src="${link}">
        </div>
    `;
}

function getVideoPreview(file) {
    return ``;
}