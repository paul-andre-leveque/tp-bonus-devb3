const { app, BrowserWindow } = require('electron');
const Store = require('electron-store');

let win;
const store = new Store();

function createWindow () {
    win = new BrowserWindow({
        width: store.get('windowBounds.width', 800),
        height: store.get('windowBounds.height', 600),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            partition: 'persist:myPartition'
        }
    });


    win.loadURL(process.argv[2] || store.get('lastUrl') || 'https://fr.wikipedia.org');

    win.on('close', () => {
        store.set('windowBounds', win.getBounds());
        store.set('lastUrl', win.webContents.getURL());
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
