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

    if(! fs.existsSync(link))
        return '<div class="error-box"><i class="fas fa-exclamation-triangle"></i> This file does not exist!</div>';

    let output = `
        <div id="infoBoxButtons">
            <div id="openFileBtn" data-path="${link}" class="dark-inp light-inp btn"> 
                <i class="fas fa-external-link-alt"></i> Open File
            </div>
            <div id="showFileInFolder" data-path="${link}" class="dark-inp light-inp btn">
                <i class="fas fa-folder-open"></i> Show File in Directory
            </div>
        </div>
    `;
    
    if(pictures.includes(format)){
        output += getPicturePreview(link);
    }

    if(videos.includes(format)){
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

function getVideoPreview(link) {
    return `
        <div id="videoPreview">
            <video controls class="video-js" preload="auto" data-setup="{}">
                <source src="${link}" type="video/mp4">
            </video>
        </div>
    `;
}