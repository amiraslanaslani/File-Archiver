var dbLoader = require('../JS/db.loader.js');

var showFileIcons = require('../JS/showFileIcons.js');
var filesViewPage = require('../JS/filesViewPage.js');
var fileAddPage = require('../JS/fileAddPage.js');

$(() => {
    dbLoader.load();
    filesViewPage.load();
})

/* * * * * * * * * * * * * * * * * * * * * * * */
