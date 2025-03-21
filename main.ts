const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('node:path')
const electronReload = require('electron-reload');
const { getEntries,FilterSpells,SearchSpellsCard } = require('./database.js');
const { fetchCharacterJSON } = require('./jsonFetch.js');

electronReload(__dirname);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    webPreferences:{
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('spellDisplayV2.html')
}

// Extend the global Window interface

ipcMain.handle("get-entries", async () => {
    return new Promise((resolve) => {
      getEntries(resolve);
    });
  });
  ipcMain.handle("Search-Spells-Card", async (_: any,spell: any) => {
    return new Promise((resolve) => {
      SearchSpellsCard(spell,resolve);
    });
  });
  ipcMain.handle("Filter-Spells", async (_: any,filterDict: any) => {
    return new Promise((resolve) => {
      FilterSpells(filterDict,resolve);
    });
  });

  ipcMain.handle("fetch-character-json", async () => {
    return new Promise((resolve) => {
      fetchCharacterJSON(resolve);
    });
  });




app.whenReady().then(() => {
  createWindow()
})
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })