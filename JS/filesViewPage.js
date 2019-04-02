const fileModel = require('./Models/file.js');
const path = require('path');
const fs = require("fs");
const previewLoader = require("./previewLoader.js");
const shell = require('electron').shell;
const viewLoader = require('./viewLoader.js');
const dialogs = require('./dialogs.js');

let rightCol = (files) => {
    let filesForView = [];

    files.forEach(file => {
        filesForView.push({
            id: file.id,
            img: '', //TODO add correct picture
            type: 'file',
            name: file.name
        });
    });

    let iconsView = showFileIcons.load(
        filesForView,
        function(id){
            fileModel.loadWithID(id, (row) => {
                $('#fileInfoBox').data('file', row);
                fileModel.loadTagsListWithFileID(row.id, (tags) => {
                    tagsList = [];
                    tags.forEach(tag => {
                        tagsList.push(tag.tag);
                    });

                    let type = path.extname(row.file_name).toUpperCase();
                    
                    file_path = row.using_path == 1 ? '' : './Files/';
                    file_path += row.file_name;
                    
                    size = `<a class="errorText">This file does not exist!</a>`;
                    if(fs.existsSync(file_path)){
                        let stats = fs.statSync(file_path);
                        size = `${stats.size} KB (${stats.size / 1024} MB)`
                    }

                    let picture = showFileIcons.getFileImage({
                        id: row.id,
                        img: '', //TODO add correct picture
                        type: 'file'
                    });

                    openInfoBox(
                        row.name, 
                        type, 
                        size, 
                        row.description, 
                        tagsList.join(', '),
                        picture
                    );
                });
            })
        }
    );

    return viewLoader.load(
        'file_view_right.html', 
        {iconsView}
    );
}

let leftCol = (tags) => {
    let content = '';

    for(let tagID in tags){
        let tag = tags[tagID].tag;
        let lowercase_tag = tag.toLowerCase();
        content += viewLoader.load(
            'file_view_left/repeatable.html', 
            {lowercase_tag, tag}
        );
    }

    return viewLoader.load(
        'file_view_left/main.html', 
        {content}
    );
}

function showRightSide(selectedTags = [], searchString = ''){
    fileModel.loadFilesFromTagAndSearchString(selectedTags, searchString, (rows) => {
        $('#rightCol').html(rightCol(rows));
        $('#closeButton').click(() => {
            closeInfoBox();
        })
        $('#maximizeButton').click(() => {
            maximizeInfoBox();
        });
        $('#minimizeButton').click(() => {
            minimizeInfoBox();
        });
    })
}

function maximizeInfoBox(){
    $('#maximizeButton').hide();
    $('#minimizeButton').show();
    $('#fileIconsList, #fileInfoBox').addClass('maximized');

    $("#filePreview").html(
        previewLoader.load(
            $('#fileInfoBox').data('file')
        )
    );

    $("#openFileBtn").click(function(){
        let path = $(this).data('path');
        shell.openItem(path);
    });

    $("#showFileInFolder").click(function(){
        let path = $(this).data('path');
        shell.showItemInFolder(path);
    });

    //TODO add edit file btn's action
    $('#editFile').click(function(){
        dialogs.openContentDialogWithDefaultParameters(
            $('#fileInfoBox').data('file').id
        );
    })

    $("#removeFile").click(function(){
        fileModel.removeFromID(
            $('#fileInfoBox').data('file').id,
            function(){
                refreshView()
            }
        );
    });
}

function minimizeInfoBox(){
    $('#maximizeButton').show();
    $('#minimizeButton').hide();
    $('#fileIconsList, #fileInfoBox').removeClass('maximized');
    setTimeout(function(){
        $("#filePreview").html("");
    }, 1000);
}

function showLeftSide(){
    fileModel.loadTagsList(function(tags){
        $('#leftCol').html(leftCol(tags));

        filesViewPage.leftPanelLoad();

        $('#leftColBtn').click(() => {
            fileAddPage.load();
        });
    });
}

function openInfoBox(name, type, size, desc, tags, picture){
    $('#fileInfoBox, #fileIconsList').addClass('infoBoxIsOpened');
    $('#fileInfo_name').html(name);
    $('#fileInfo_type').html(type);
    $('#fileInfo_size').html(size);
    $('#fileInfo_desc').html(desc);
    $('#fileInfo_tags').html(tags);
    $('#fileInfo_picture').attr("src",picture);
}

function closeInfoBox(){
    minimizeInfoBox();
    $('#fileInfoBox, #fileIconsList').removeClass('infoBoxIsOpened');
}

function refreshView(){
    let searchString = $('#fileSearch').val().trim();
    let selectedTags = $('#tagsBox input:checked').map(function() {
        return $(this).data('tag');
    }).get();

    showRightSide(selectedTags, searchString);
}

exports.leftPanelLoad = function(){
    $('#tagsBox span').click(function(){
        $(this).find('input[type=checkbox]').click();
    });

    $('#tagsBox span input[type=checkbox]').click(function(){
        refreshView();
    })

    $('#fileSearch').keyup(function(){
        refreshView();
    })

    $('#tagSearch').keyup(function(){
        let searchString = $('#tagSearch').val().trim().toLowerCase();
        if(searchString == ''){
            $(`#tagsBox span`).show();
        }
        else{
            $(`#tagsBox span`).hide();
            $(`#tagsBox span[data-tag*='${searchString}']`).show();
        }
    })
}

exports.load = function() {
    showRightSide();
    showLeftSide();
}
