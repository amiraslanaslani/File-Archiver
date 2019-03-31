
function loadBaseStructure(innerHtml){
    return `
        <div id="fileIconsList" class="light-scroll">
            ${innerHtml}
        </div>
        <script>
            $('.fileObject').click(function(){
                showFileIcons.checkAsSelected(this)
            });
        </script>
    `;
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

        content += `
            <div class="fileObject" data-id="${file.id}">
                <div class="fileImgDiv">
                    <img src="${img}">
                </div>
                <div class="fileTextDiv">
                    ${file.name}
                </div>
            </div>
        `;
    }

    return loadBaseStructure(content);
}

exports.checkAsSelected = function(obj){
    $('.selected').removeClass('selected');
    $(obj).addClass('selected');

    let selectedID = $(obj).data('id');
    fileCheckAction(selectedID);
}
