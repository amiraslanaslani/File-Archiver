const fileModel = require('./Models/file.js');

let rightCol = () => {
    return `
        right
        Col
        Files View
    `
}

let leftCol = () => {
    return `
        <div id="leftColTopContent">
            <div id="tagSelection">
                <input class="dark-inp" type="text" id="tagSearch" placeholder="Search">
                <div id="tagsBox">
                    <span>
                        <div class="check">
                            <input type="checkbox" data-tag="Tag Name 1">
                            <div class="box"></div>
                        </div>
                        <a>
                            Tag Name 
                        </a>
                    </span>
                    <span>
                        <div class="check">
                            <input type="checkbox" data-tag="Tag Name 2">
                            <div class="box"></div>
                        </div>
                        <a>
                            Tag Name Is Can Be Too Long, If I Want IT!
                        </a>
                    </span>
                    <span>
                        <div class="check">
                            <input type="checkbox" data-tag="Tag Name 3">
                            <div class="box"></div>
                        </div>
                        <a>
                            Tag Name 
                        </a>
                    </span>
                    <span>
                        <div class="check">
                            <input type="checkbox" data-tag="Tag Name 4">
                            <div class="box"></div>
                        </div>
                        <a>
                            Tag Name 
                        </a>
                    </span>
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
    $('#rightCol').html(rightCol());
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
    $('#leftCol').html(leftCol());
    $('#leftColBtn').click(() => {
        fileAddPage.load();
    });
    fileModel.load();
}
