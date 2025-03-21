const { contextBridge,ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('db', {
  getEntries: () => ipcRenderer.invoke('get-entries'),
  SearchSpellsCard: (spell: any) => ipcRenderer.invoke('Search-Spells-Card', spell),
  FilterSpells: (filterDict: any) => ipcRenderer.invoke('Filter-Spells', filterDict)
})
contextBridge.exposeInMainWorld('json', {
  fetchCharacterJSON: () => ipcRenderer.invoke('fetch-character-json')
})

