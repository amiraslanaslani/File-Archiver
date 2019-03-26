const { dialog } = require('electron').remote;
var fs = require('fs');
var isFileSelected = false;

let rightCol = () => {
    return `
        <br><br><br>
        <button class="dark-inp light-inp" onClick="fileAddPage.selectFile()">
            Select File
        </button>
        <div id="selectedFilesInfo">
            <p>
                <strong>Path: </strong> <span id="pathInfo">-</span><br>
                <strong>File Size: </strong> <span id="sizeInfo">-</span><br>
                <strong>Tags: </strong> 
            </p>
            <div id="tagsDiv">
            </div>
        </div>
    `
}

let leftCol = () => {
    return `
        <div id="leftColTopContent">
            <input id="filePath" class="dark-inp" type="text" placeholder="File Path" value="" disabled="disabled">
            <br>
            <input id="fileName" class="dark-inp" type="text" placeholder="Name" value="">
            <br>
            <input id="fileTags" class="dark-inp" type="text" placeholder="Tags" value="">
            <br>
            <textarea class="dark-inp" placeholder="Description"></textarea>
            <br>
            <button class="dark-inp">Add File</button>
        </div>
        <div id="leftColBtn">
            <span>
                ◀ &nbsp; Back
            </span>
        </div>
        <script>
            $('#fileTags').keypress(fileAddPage.tagsKeyPress)
        </script>
    `
}

var tagsNumber = 0;
var tags = [];
exports.tagsKeyPress = function(ev) {
    let code = ev.which;
    if(code == 13 || code == 44){
        ev.preventDefault();
        let tagName = $('#fileTags').val().replace(',','').trim();
        if(tagName.length > 0){
            tagsNumber = tagsNumber + 1;
            tags.push(tagName);
            $("#tagsDiv").html(
                $("#tagsDiv").html() +
                `<span id="tag-${tagsNumber}">
                    ${tagName}
                    <a data-id="tag-${tagsNumber}" data-value="${tagName}">×</a>
                </span>
                <script>
                    $('#tagsDiv span a').click(fileAddPage.removeTag)
                </script>`
            );
        }

        $('#fileTags').val('');
    }
}

exports.removeTag = function() {
    let id = $(this).data('id').trim();
    let value = $(this).data('value').trim();

    $("#" + id).remove();

    for(var i = 0;i < tags.length;i ++){
       if (tags[i] == value) {
         tags.splice(i, 1);
       }
    }
}

exports.selectFile = function() {
    let selected = dialog.showOpenDialog(
        {
            properties: ['openFile']
        }
    );
    if(selected == undefined || selected == null){
        return;
    }

    selected = selected[0];

    try{
        let fileStat = fs.statSync(selected);

        if(fileStat.isFile){
            let filePath = selected;

            isFileSelected = true;
            $('#filePath').val(filePath);
            $('#pathInfo').html(filePath);
            let sizeInKBs = ~~ (fileStat['size'] / 1024);
            let sizeInMBs =  parseFloat(fileStat['size'] / (1024 * 1024)).toFixed(2);
            $('#sizeInfo').html(`${sizeInKBs} KB (${sizeInMBs} MB)`);

            let path = filePath.split('/');
            let fileName = path[path.length - 1];
            fileName = fileName.split('.');
            fileName.pop();
            let name = fileName.join('.');
            $('#fileName').val(name);
        }
        else {
            alert('Please select a file. (You are selected a directory)');
        }

    }
    catch(err){
        alert(err);
        alert('File does not exist!');
    }
}

exports.load = function() {
    $('#rightCol').html(rightCol());
    $('#leftCol').html(leftCol());
    $('#leftColBtn').click(() => {
        filesViewPage.load();
    });
}
