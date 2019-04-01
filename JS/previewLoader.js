const path = require('path');
const fs = require('fs');
const viewLoader = require('./viewLoader.js');

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

    if(! fs.existsSync(link))
        return viewLoader.load(
            'preview_loader/error.html'
        );

    let output = viewLoader.load(
        'preview_loader/base.html',
        {link}
    );
    
    if(pictures.includes(format)){
        output += getPicturePreview(link);
    }

    if(videos.includes(format)){
        output += getVideoPreview(link);
    }

    return output;
}

function getPicturePreview(link) {
    return viewLoader.load(
        'preview_loader/picture.html',
        {link}
    );
}

function getVideoPreview(link) {
    return viewLoader.load(
        'preview_loader/video.html',
        {link}
    );
}