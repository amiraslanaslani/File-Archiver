const viewLoader = require('./viewLoader.js');

function loadBaseStructure(innerHtml){
    return viewLoader.load(
        'file_icons/base.html',
        {innerHtml}
    );
}

exports.getFileImage = function(file){
    var img = '../Pictures/';

    if(file.img == ''){
        if(file.type == 'folder'){
            img += 'folder.png';
        }
        else{
            img += 'file.png';
        }
    }
    else {
        img += file.img;
    }

    return img;
}

var currentLoadedFilesList;
var fileCheckAction;
exports.load = (filesList, checkAction) => {
    currentLoadedFilesList = filesList;
    fileCheckAction = checkAction;

    var content = '';
    for(var fileID in filesList){
        var file = filesList[fileID];
        var img = exports.getFileImage(file);

        content += viewLoader.load(
            'file_icons/object.html',
            {
                img,
                'file_name': file.name,
                'file_id': file.id
            }
        );
    }

    return loadBaseStructure(content);
}

exports.checkAsSelected = function(obj){
    $('.selected').removeClass('selected');
    $(obj).addClass('selected');

    let selectedID = $(obj).data('id');
    fileCheckAction(selectedID);
}
