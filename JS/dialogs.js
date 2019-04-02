const viewLoader = require('./viewLoader.js');

function getDialog(box, id, classes = ''){
    return viewLoader.load(
        'dialogs/main.html',
        {box, id, classes}
    );
}

exports.openLoadingDialog = function(){
    
    let dialog = getDialog(
        viewLoader.load(
            'dialogs/loading.html'
        ), 'loadingDialog'
    );

    let current = $('body').html();
    $('body').html(current + dialog);
}

exports.closeLoadingDialog = function(){
    $('#loadingDialog').fadeOut(500, function(){
        $(this).remove();
    });
}

exports.openErrorDialog = function(error, isCentralized = false){
    let centralized = '';
    if(isCentralized)
        centralized = 'centralized';

    let dialog = getDialog(
        viewLoader.load(
            'dialogs/error.html',
            {centralized, error}
        ),
        "errorDialog"
    );

    $('body').append(dialog);

    $('#errorDialog .errorDialogHeader a').click(function(){
        exports.closeErrorDialog();
    });
}

exports.closeErrorDialog = function(){
    $('#errorDialog').fadeOut(500, function(){
        $(this).remove();
    });
}

/**
 * Content Dialog (File's Edit Dialog)
 */

const fileModel = require('./Models/file.js');

exports.openContentDialogWithDefaultParameters = function(id){
    fileModel.loadWithID(id, (row) => {
        fileModel.loadTagsListWithFileID(row.id, (tags) => {
            exports.openContentDialog(row.name, row.description);
            
            for(let i in tags){
                let tag = tags[i];
                contentDialogAddTag(tag.tag);
            }
        });
    });
}

var contentDialogTags = [];
var dialogTagsNumber = 0;
exports.openContentDialog = function(name, desc){
    contentDialogTags = [];
    dialogTagsNumber = 0;

    let dialog = getDialog(
        viewLoader.load(
            'dialogs/content.html',
            {name, desc}
        ),
        "contentDialog",
        "contentDialog"
    );

    $('body').append(dialog);

    $('#contentDialog .contentDialogHeader a, #dialogCancel').click(function(){
        exports.closeContentDialog();
    });

    $('#dialogSave').click(() => {
        
        
    });

    $('#dialogFileTags').keypress(contentDialogTagsKeyPress);
}

exports.closeContentDialog = function(){
    $('#contentDialog').fadeOut(500, function(){
        $(this).remove();
    });
}

function contentDialogAddTag(tag){
    dialogTagsNumber = dialogTagsNumber + 1;
    tag = tag.replace(',','').trim();

    $(".tagsBox").html(
        $(".tagsBox").html() +
        `<span id="tag-${dialogTagsNumber}">
            ${tag}
            <a data-id="tag-${dialogTagsNumber}" data-value="${tag}">
                <i class="fas fa-times"></i>
            </a>
        </span>`
    );

    contentDialogTags.push(tag);
}

function removeTag() {
    let id = $(this).data('id').trim();
    let value = $(this).data('value').trim();

    $("#" + id).remove();

    for(var i = 0;i < contentDialogTags.length;i ++){
        if (contentDialogTags[i] == value) {
            contentDialogTags.splice(i, 1);
        }
    }
}

function contentDialogTagsKeyPress(ev) {
    let code = ev.which;
    if(code == 13 || code == 44){
        ev.preventDefault();
        let tagName = $('#dialogFileTags').val().replace(',','').trim();
        if(tagName.length > 0){
            contentDialogAddTag(tagName);
            $('.tagsBox span a').click(removeTag);
        }

        $('#dialogFileTags').val('');
    }
}