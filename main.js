const electron = require('electron')
const url = require('url')
const path = require('path')


const app = electron?.app
const BrowserWindow = electron?.BrowserWindow // we can also use destructuring method
const { Menu, ipcMain } = electron
process.env.Node_ENV = 'production'
let mainWindow
let addItemWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        format: "file:",
        slashes: true,
    }))
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

mainWindow?.on('closed', function () {
    app.quit()
})

function createAddWindow() {
    addItemWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add Shoppping List Items",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    addItemWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addItem.html'),
        format: "file:",
        slashes: true,
    }))
    addItemWindow.on('closed', function () {
        addItemWindow = null
    })
}

ipcMain.on('item:add', function (e, item) {
    mainWindow.webContents.send('item:add', item)
    addItemWindow.close()
})



const mainMenuTemplate = [{
    label: 'File', submenu: [{
        label: "Add Item", click() {
            createAddWindow()
        }
    }, {
        label: "Clear Items", click() {
            mainWindow.webContents.send('item:clear')
        }
    }, {
        label: "Close", accelerator: process.platform === 'darwin' ? "Command+Q" : "CTRL+Q", click() {
            app.quit()
        }
    }]
}]
// if mac , add empty object to the menu 
if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({})
}
// add developer tools Item if not in production
if (process.env.Node_ENV !== 'production') {
    mainMenuTemplate.push({
        label: "Developer Tools",
        submenu: [{
            label: "Toggle Dev Tools",
            accelerator: process.platform === 'darwin' ? "Command+I" : "CTRL+I",
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        },
        {
            role: "reload"
        }


        ]
    })
}