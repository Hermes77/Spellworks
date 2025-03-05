const { contextBridge,ipcRenderer } = require('electron')
const { getEntries } = require('./database')


contextBridge.exposeInMainWorld('api', {
  getEntries: () => ipcRenderer.invoke('get-entries'),
  SearchSpellsCard: (spell) => ipcRenderer.invoke('Search-Spells-Card',spell)
})

