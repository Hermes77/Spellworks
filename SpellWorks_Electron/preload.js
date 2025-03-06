const { contextBridge,ipcRenderer } = require('electron')
const { getEntries, FilterSpells,SearchSpellsCard } = require('./database')


contextBridge.exposeInMainWorld('api', {
  getEntries: () => ipcRenderer.invoke('get-entries'),
  SearchSpellsCard: (spell) => ipcRenderer.invoke('Search-Spells-Card',spell),
  FilterSpells: (filterDict) => ipcRenderer.invoke('Filter-Spells',filterDict)
})

