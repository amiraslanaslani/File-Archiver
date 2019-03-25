const { dialog } = require('electron').remote;
var fs = require('fs');
var isFileSelected = false;

let rightCol = () => {
    return `
        <br><br><br>
        <button class="dark-inp out-inp" onClick="fileAddPage.selectFile()">
            Select File
        </button>
    `
}

let leftCol = () => {
    return `
        <div id="leftColTopContent">
            <input id="filePath" class="dark-inp" type="text" placeholder="File Path" value="" disabled="disabled">
            <br>
            <input id="fileName" class="dark-inp" type="text" placeholder="Name" value="">
            <br>
            <input class="dark-inp" type="text" placeholder="Tags" value="">
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
    `
}

function setFileAsSelected(filePath) {
    isFileSelected = true;
    $('#filePath').val(filePath);

    let path = filePath.split('/');
    let fileName = path[path.length - 1];
    fileName = fileName.split('.');
    fileName.pop();
    let name = fileName.join('.');
    $('#fileName').val(name);
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
            setFileAsSelected(selected);
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
