let rightCol = () => {
    return `
        right
        Col
        Add File
    `
}

let leftCol = () => {
    return `
        <div id="leftColTopContent">
            <input class="dark-inp" type="text" placeholder="File Path" value="" disable>
            <br>
            <input class="dark-inp" type="text" placeholder="Name" value="">
            <br>
            <input class="dark-inp" type="text" placeholder="Tags" value="">
            <br>
            <textarea class="dark-inp"></textarea>
        </div>
        <div id="leftColBtn">
            <span>
                ◀ &nbsp; Back
            </span>
        </div>
    `
}

exports.load = function() {
    $('#rightCol').html(rightCol());
    $('#leftCol').html(leftCol());
    $('#leftColBtn').click(() => {
        filesViewPage.load();
    });
}
