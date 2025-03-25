"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const electronReload = require('electron-reload');
const { getEntries, FilterSpells, SearchSpellsCard } = require('./database.js');
const { fetchCharacterJSON, CharacterClass } = require('./jsonFetch.js');
electronReload(__dirname);
const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // win.webContents.openDevTools()
    win.loadFile('spellDisplayV2.html');
};
// Extend the global Window interface
ipcMain.handle("get-entries", () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        getEntries(resolve);
    });
}));
ipcMain.handle("Search-Spells-Card", (_, spell) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        SearchSpellsCard(spell, resolve);
    });
}));
ipcMain.handle("Filter-Spells", (_, filterDict) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        FilterSpells(filterDict, resolve);
    });
}));
ipcMain.handle("fetch-character-json", () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        fetchCharacterJSON(resolve);
    });
}));
ipcMain.handle("Character-Class", () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        CharacterClass(resolve);
    });
}));
app.whenReady().then(() => {
    createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
