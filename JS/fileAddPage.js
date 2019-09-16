const { dialog } = require('electron').remote;
const fileModel = require('./Models/file.js');
const dialogs = require('./dialogs.js');
const path = require('path');
const viewLoader = require('./viewLoader.js');

var fs = require('fs');
var isFileSelected = false;
var allTags = [];

function resetPage(notLoadedTags){
    notLoadedTags = notLoadedTags || [];

    $('#fileName').val('');
    $('#fileDesc').val('');
    $('#filePath').val('');
    $('#fileTags').val('');
    $('#pathInfo').html('');
    $('#sizeInfo').html('');
    $('#tagsDiv').html('');

    fileModel.loadTagsList((tags) => {
        console.log(notLoadedTags);
        console.log("Tags1: " + tags);
        tags = tags.concat(notLoadedTags);
        console.log('Tags1.5: ' + tags);
        
        tags = tags.filter(function(item, pos) {
            return tags.indexOf(item) == pos;
        });

        console.log("Tags2: " + tags);
        
        $("#fileTags").autocomplete('option', 'source', tags);
    });

    isFileSelected = false;
    tags = [];
    tagsNumber = 0;
}

exports.addFileBtn = function() {
    if(! isFileSelected){
        dialogs.openErrorDialog('Please Select a file at the first!', true);
        return;
    }

    let filePath = $('#filePath').val();
    let name = $('#fileName').val();
    let desc = $('#fileDesc').val();

    if(! $('#pathUsingCheckBox').is(':checked')){
        let filePathName = path.basename(filePath);
        let newFileName = generate_random_string(5) + '_' + filePathName;

        dialogs.openLoadingDialog();
        fs.copyFile(filePath, 'Files/' + newFileName, (err) => {
            dialogs.closeLoadingDialog();
            if(err) {
                dialogs.openErrorDialog(err);
            }
            else {
                let file = newFileName;

                fileModel.add(name, desc, file, tags, false);
                resetPage(tags);
            }
        });
    }
    else{
        if($('#relativePathUsingCheckBox').prop('checked')){
            let basePath = path.resolve(__dirname, '../');
            
            let relativePath = path.relative(
                basePath, 
                filePath
            );

            fileModel.add(name, desc, relativePath, tags, true);
        }
        else{
            fileModel.add(name, desc, filePath, tags, true);
        }
        resetPage(tags);
    }
    
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
                    $('#tagsDiv span#tag-${tagsNumber} a').click(fileAddPage.removeTag)
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
            dialogs.openErrorDialog('Please select a file. (You are selected a directory)', true);
        }

    }
    catch(err){
        dialogs.openErrorDialog(err);
    }
}

exports.load = function() {
    document.getElementById("rightCol").innerHTML = viewLoader.load('file_add_right.html');
    document.getElementById("leftCol").innerHTML = viewLoader.load('file_add_left.html');

    $('#fileTags').keypress(fileAddPage.tagsKeyPress);
    $('#addFileBtn').click(fileAddPage.addFileBtn);

    $('#leftColBtn').click(() => {
        filesViewPage.load();
    });
    $('#pathUsingCheckBox').change(function(){
        if(this.checked)
            $('#relativePathUsingCheckBoxDiv').show(500);
        else
            $('#relativePathUsingCheckBoxDiv').hide(500);
    });

    fileModel.loadTagsList((tags) => {
        $('#fileTags').autocomplete({
            source: tags
        });
    })
}

function generate_random_string(string_length){
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}
