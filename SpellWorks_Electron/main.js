const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('node:path')

const { getEntries,SearchSpells } = require('./database')


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('spellDisplayV2.html')
}

ipcMain.handle("get-entries", async () => {
    return new Promise((resolve) => {
      getEntries(resolve);
    });
  });
  ipcMain.handle("Search-Spells", async (_,spell) => {
    return new Promise((resolve) => {
      SearchSpells(spell,resolve);
    });
  });

app.whenReady().then(() => {
  createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })