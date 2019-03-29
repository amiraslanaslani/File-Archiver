const {app, BrowserWindow} = require('electron')

app.once('ready', () => {
    let window = new BrowserWindow({
        width: 960,
        height: 600,
        frame: true
    })

    window.setMenuBarVisibility(false)
    window.loadFile('View/main.html')

    window.once('ready-to-show', () => {
        window.show()
    })
})
