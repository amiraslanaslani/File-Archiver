
exports.openLoadingDialog = function(){
    console.log('Dialog is opened!');
    
    let dialog = `
        <div id="loadingDialog">
            <div id="helperDialog">
                <div id="mainDialog">
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
                    </div>

                </div>
            </div>
        </div>
    `;

    let current = $('body').html();
    $('body').html(current + dialog);
}

exports.closeLoadingDialog = function(){
    $('#loadingDialog').fadeOut(500);
}