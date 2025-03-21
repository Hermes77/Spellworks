"use strict";
const { contextBridge, ipcRenderer } = require('electron');
const { getEntries: dbGetEntries, FilterSpells: dbFilterSpells, SearchSpellsCard: dbSearchSpellsCard } = require('./database.js');
contextBridge.exposeInMainWorld('api', {
    getEntries: () => ipcRenderer.invoke('get-entries'),
    SearchSpellsCard: (spell) => ipcRenderer.invoke('Search-Spells-Card', spell),
    FilterSpells: (filterDict) => ipcRenderer.invoke('Filter-Spells', filterDict)
});
