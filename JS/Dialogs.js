
function getDialog(box, id){
    return `
        <div class="dialog" id="${id}">
            <div class="dialogHelper">
                <div class="dialogBox">
                    ${box}
                </div>
            </div>
        </div>
    `;
}

exports.openLoadingDialog = function(){
    
    let dialog = getDialog(`
        <div id="mainDialogText">
            Please Wait
        </div>
        <div id="fountainG">
            <div id="fountainG_1" class="fountainG"></div>
            <div id="fountainG_2" class="fountainG"></div>
            <div id="fountainG_3" class="fountainG"></div>
            <div id="fountainG_4" class="fountainG"></div>
            <div id="fountainG_5" class="fountainG"></div>
            <div id="fountainG_6" class="fountainG"></div>
            <div id="fountainG_7" class="fountainG"></div>
            <div id="fountainG_8" class="fountainG"></div>
        </div>`,
        'loadingDialog'
    );

    let current = $('body').html();
    $('body').html(current + dialog);
}

exports.closeLoadingDialog = function(){
    $('#loadingDialog').fadeOut(500, function(){
        $(this).remove();
    });
}

exports.openErrorDialog = function(error){
    let dialog = getDialog(`
        <div class="errorDialogHeader">
            <a>
                ×
            </a>
        </div>
        <div>
            <p>
                ${error}
            </p>
        </div>
        `,
        "errorDialog"
    );

    let current = $('body').html();
    $('body').html(current + dialog);

    $('#errorDialog .errorDialogHeader a').click(function(){
        exports.closeLoadingDialog();
    })
}

exports.closeLoadingDialog = function(){
    $('#errorDialog').fadeOut(500, function(){
        $(this).remove();
    });
}