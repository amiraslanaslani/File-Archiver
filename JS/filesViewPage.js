const fileModel = require('./Models/file.js');
const path = require('path');
const fs = require("fs");

let rightCol = (files) => {
    let filesForView = [];

    files.forEach(file => {
        filesForView.push({
            id: file.id,
            img: '', //TODO add correct picture
            type: 'file',
            name: file.name
        });
    });name

    let iconsView = showFileIcons.load(
        filesForView,
        function(id){
            fileModel.loadWithID(id, (row) => {
                fileModel.loadTagsListWithFileID(row.id, (tags) => {
                    tagsList = [];
                    tags.forEach(tag => {
                        tagsList.push(tag.tag);
                    });

                    let type = path.extname(row.file_name).toUpperCase();
                    
                    file_path = row.using_path == 1 ? '' : './Files/';
                    file_path += row.file_name;
                    
                    size = `<a class="errorText">This file is not exists!</a>`;
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

    return `
        ${iconsView}
        <div id="fileInfoBox">
            <div id="fileInfoImgDiv">
                <img id="fileInfo_picture" src="">
            </div>
            <div id="fileInfoTextDiv">
                <strong>Name:</strong> <span id="fileInfo_name"></span><br>
                <strong>File Type:</strong> <span id="fileInfo_type"></span><br>
                <strong>File Size:</strong> <span id="fileInfo_size"></span><br>
                <strong>Description:</strong> <span id="fileInfo_desc"></span><br>
                <strong>Tags:</strong> <span id="fileInfo_tags"></span>
            </div>
            <div id="buttonBar">
                <a id="maximizeButton">
                    🗖
                </a>
                <a id="closeButton">
                    ×
                </a>
            </div>
        </div>
    `;
}

let leftCol = (tags) => {

    let content = '';

    for(let tagID in tags){
        let tag = tags[tagID].tag;
        let lowercase_tag = tag.toLowerCase();
        content += `
            <span data-tag="${lowercase_tag}">
                <div class="check-light">
                    <input type="checkbox" data-tag="${tag}">
                    <div class="box"></div>
                </div>
                <a>${tag}</a>
            </span>
        `;
    }

    return `
        <div id="leftColTopContent">
            <div id="tagSelection">
                <input class="dark-inp" type="text" id="fileSearch" placeholder="File Search"><br>
                <input class="dark-inp" type="text" id="tagSearch" placeholder="Tag Search">
                <div id="tagsBox">
                    ${content}
                </div>
            </div>
        </div>
        <div id="leftColBtn">
            <span>
                ➕ Add New File
            </span>
        </div>
        <script>
            filesViewPage.leftPanelLoad();
        </script>
    `;
}

function showRightSide(selectedTags = [], searchString = ''){
    fileModel.loadFilesFromTagAndSearchString(selectedTags, searchString, (rows) => {
        // console.log(rows);
        $('#rightCol').html(rightCol(rows));
        $('#closeButton').click(() => {
            closeInfoBox();
        })
    })
}

function showLeftSide(){
    fileModel.loadTagsList(function(tags){
        $('#leftCol').html(leftCol(tags));

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
