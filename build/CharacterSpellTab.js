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
function fetchCharSpellData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const spellContainer = document.getElementById("CharacterSpellInfo");
            const charData = yield window.json.fetchCharacterJSON();
            for (const spell of charData.spells) {
                const spellentry = document.createElement("div");
                spellentry.classList.add("spell-entry");
                const fullSpell = yield fetchSpellData(spell);
                if (fullSpell) {
                    spellentry.innerHTML = `
                         <span class="spell-name-list">${fullSpell.Spell}</span>
                         <span class="spell-info-list">${fullSpell.Level}</span>
                         <span class="spell-info-list">${fullSpell.Range}</span>`;
                }
                else {
                    console.warn(`Spell data not found for: ${spell}`);
                }
                spellContainer === null || spellContainer === void 0 ? void 0 : spellContainer.appendChild(spellentry);
            }
        }
        catch (error) {
            console.error("Error displaying data:", error);
        }
    });
}
;
fetchCharSpellData();
//TODO move Function
// I think this function should be a wrapper function for SearchSpellsCard in database.ts
function fetchSpellData(spellSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield window.db.SearchSpellsCard(spellSearch);
            return response;
        }
        catch (error) {
            console.error("Error fetching spell:", error);
            return null;
        }
    });
}
