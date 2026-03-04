const { app, Tray, Menu } = require('electron')
const path = require('path')

let tray = null

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'icon.png'))

    const contextMenu = Menu.buildFromTemplate([
        {label: 'test', click: () => console.log("TEST!!!")},
        {type: 'separator'},
        {label: 'quit', click: () => {app.quit()}}
    ])

    tray.setToolTip('Terra Presence')
    tray.setContextMenu(contextMenu) 
})