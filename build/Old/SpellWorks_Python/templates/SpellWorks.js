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
function list_spell(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // event.preventDefault();
            const spells = yield window.pywebview.api.list_Spells(); // Call Python API
            console.log(spells);
            if (!spells || spells.error) {
                document.getElementById("spell-name").textContent = "No spell found";
                return;
            }
            // Clear existing spell cards
            document.getElementById("spell-container").innerHTML = "";
            spells.forEach(spell => {
                const spellentry = document.createElement("div");
                spellentry.classList.add("spell-entry");
                spellentry.innerHTML = `<div class="spell-name" onclick="search_spell(
                                                   event,'${spell.Spell}','SpellDisplay',1)"><strong>${spell.Spell}</strong></div>`;
                // Append the new spell card to the container
                document.getElementById("spell-container").appendChild(spellentry);
            });
        }
        catch (error) {
            console.error("Error fetching spell:", error);
            document.getElementById("errorlabel").textContent = "Error loading spell";
        }
    });
}
window.addEventListener('pywebviewready', function () { list_spell(); });
function getSpellLists(spell) {
    const Classes = [];
    for (let key in spell) {
        if (key.includes('Spell_lists')) {
            if (spell[key] !== null) {
                Classes.push(spell[key]);
            }
        }
    }
    console.log(Classes);
    return Classes;
}
function search_spell(event, spellSearch, toWriteTo, amt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const spells = yield window.pywebview.api.search_spell(spellSearch, amt); // Call Python API
            console.log(spells);
            if (!spells || spells.error) {
                document.getElementById("spell-name").textContent = "No spell found";
                return;
            }
            // Clear existing spell cards
            document.getElementById(toWriteTo).innerHTML = "";
            spells.forEach(spell => {
                const spellCard = document.createElement("div");
                spellCard.classList.add("spell-card");
                spellCard.innerHTML = `
                    <div class="spell-name"><strong>${spell.Spell}</strong></div>
                    <div class="spell-level"><strong>${spell.Level}</strong></div>
                    <div class="spell-detail"><strong>Source:</strong> <span>${spell.Source || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Casting Time:</strong> <span>${spell['Casting Time'] || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Range:</strong> <span>${spell.Range || "N/A"}</span></div>
                    <div class="spell-detail"><strong>School:</strong> <span>${spell.School || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Components:</strong> <span>${spell.Components || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Duration:</strong> <span>${spell.Duration || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Description:</strong> <span>${spell.Description || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Classes:</strong> <span>${getSpellLists(spell)}</span></div><br>
                `;
                // Append the new spell card to the container
                document.getElementById(toWriteTo).appendChild(spellCard);
            });
        }
        catch (error) {
            console.error("Error fetching spell:", error);
        }
    });
}
