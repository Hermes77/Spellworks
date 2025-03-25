"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is loaded before the renderer process is loaded
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('db', {
    getEntries: () => ipcRenderer.invoke('get-entries'),
    SearchSpellsCard: (spell) => ipcRenderer.invoke('Search-Spells-Card', spell),
    FilterSpells: (filterDict) => ipcRenderer.invoke('Filter-Spells', filterDict)
});
contextBridge.exposeInMainWorld('json', {
    fetchCharacterJSON: () => ipcRenderer.invoke('fetch-character-json'),
    CharacterClass: () => ipcRenderer.invoke('Character-Class')
});
