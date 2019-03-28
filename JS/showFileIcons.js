
function loadBaseStructure(innerHtml){
    return `
        <div id="fileIconsList">
            ${innerHtml}
        </div>
        <script>
            $('.fileObject').click(function(){
                showFileIcons.checkAsSelected(this)
            });
        </script>
    `;
}

var currentLoadedFilesList;
exports.load = (filesList) => {
    currentLoadedFilesList = filesList;

    var content = '';
    for(var fileID in filesList){
        var file = filesList[fileID];
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

        content += `
            <div class="fileObject" data-id="${fileID}">
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
    console.log(currentLoadedFilesList[selectedID]);
}
