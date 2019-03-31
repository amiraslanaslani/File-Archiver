const {app, BrowserWindow} = require('electron')
var path = require('path')

app.once('ready', () => {
    let window = new BrowserWindow({
        width: 960,
        height: 600,
        minWidth: 700,
        minHeight: 500,
        frame: true,
        icon: path.join(__dirname, 'Pictures/file-archiver.png')
    })

    window.setMenuBarVisibility(false)
    window.loadFile('View/main.html')

    window.once('ready-to-show', () => {
        window.show()
    })
})
