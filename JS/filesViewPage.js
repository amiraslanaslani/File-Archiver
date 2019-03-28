const fileModel = require('./Models/file.js');

let rightCol = (files) => {
    let filesForView = [];

    files.forEach(file => {
        filesForView.push({
            img: '',
            type: 'file',
            name: file.name
        });
    });

    return showFileIcons.load(filesForView);
}

let leftCol = (tags) => {

    let content = '';

    for(let tagID in tags){
        let tag = tags[tagID].tag;
        content += `
            <span data-tag="${tag}">
                <div class="check">
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
    `
}

function showRightSide(selectedTags = [], searchString = ''){
    fileModel.loadFilesFromTagAndSearchString(selectedTags, searchString, (rows) => {
        console.log(rows);
        $('#rightCol').html(rightCol(rows));
    })
}

function showLeftSide(){
    fileModel.loadTagsList(function(tags){
        $('#leftCol').html(leftCol(tags));
    });
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
        let searchString = $('#tagSearch').val().trim();
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
    $('#leftColBtn').click(() => {
        fileAddPage.load();
    });
    // fileModel.load();
}
