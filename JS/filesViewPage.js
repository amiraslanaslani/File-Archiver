const fileModel = require('./Models/file.js');

let rightCol = () => {
    return `
        right
        Col
        Files View
    `
}

let leftCol = (tags) => {

    let content = '';

    for(let tagID in tags){
        let tag = tags[tagID].tag;
        content += `
            <span>
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
                <input class="dark-inp" type="text" id="tagSearch" placeholder="Search">
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
    })
    $('#rightCol').html(rightCol());
}

function showLeftSide(){
    fileModel.loadTagsList(function(tags){
        $('#leftCol').html(leftCol(tags));
    });
}

function refreshView(){
    let searchString = $('#tagSearch').val().trim();
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

    $('#tagSearch').keyup(function(){
        refreshView();
    })
}

exports.load = function() {
    showRightSide();
    showLeftSide();
    $('#leftColBtn').click(() => {
        fileAddPage.load();
    });
    fileModel.load();
}
