const { contextBridge,ipcRenderer } = require('electron')
const { getEntries } = require('./database')


contextBridge.exposeInMainWorld('api', {
  getEntries: () => ipcRenderer.invoke('get-entries'),
  SearchSpells: (spell) => ipcRenderer.invoke('Search-Spells',spell)
})

