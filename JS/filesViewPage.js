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

        </div>
        <div id="leftColBtn">
            <span>
                ➕ Add New File
            </span>
        </div>
    `
}

exports.load = function() {
    $('#rightCol').html(rightCol());
    $('#leftCol').html(leftCol());
    $('#leftColBtn').click(() => {
        fileAddPage.load();
    });
}
