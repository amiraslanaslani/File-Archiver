const viewLoader = require('./viewLoader.js');

function getDialog(box, id){
    return viewLoader.load(
        'dialogs/main.html',
        {box, id}
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

    let current = $('body').html();
    $('body').html(current + dialog);

    $('#errorDialog .errorDialogHeader a').click(function(){
        exports.closeErrorDialog();
    })
}

exports.closeErrorDialog = function(){
    $('#errorDialog').fadeOut(500, function(){
        $(this).remove();
    });
}