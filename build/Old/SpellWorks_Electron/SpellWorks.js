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
function spellLister(spells) {
    // Clear existing spell cards
    document.getElementById("spell-container").innerHTML = "";
    const header = document.createElement("div");
    header.classList.add("spell-header");
    header.innerHTML = `<span class="spell-name-list">Spell</span><span class="spell-info-list">Level</span><span class="spell-info-list">Range</span>`;
    document.getElementById("spell-container").appendChild(header);
    spells.forEach(spell => {
        const spellentry = document.createElement("div");
        spellentry.classList.add("spell-entry");
        spellentry.setAttribute("onclick", `search_spell(event, "${spell.Spell}", 'SpellDisplay')`);
        spellentry.innerHTML = `
                    <span class="spell-name-list">${spell.Spell}</span>
                    <span class="spell-info-list">${spell.Level}</span>
                    <span class="spell-info-list">${spell.Range}</span>`;
        // Append the new spell card to the container
        document.getElementById("spell-container").appendChild(spellentry);
    });
}
function list_spell(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // event.preventDefault();
            const spells = yield window.api.getEntries();
            // console.log(spells)
            if (!spells || spells.error) {
                document.getElementById("spell-name").textContent = "No spell found";
                return;
            }
            spellLister(spells);
        }
        catch (error) {
            console.error("Error fetching spell:", error);
            document.getElementById("errorlabel").textContent = "Error loading spell";
        }
    });
}
list_spell();
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
function search_spell(event, spellSearch, toWriteTo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const spells = yield window.api.SearchSpellsCard(spellSearch); // Call Python API
            // console.log(spells)
            if (!spells || spells.error) {
                document.getElementById("spell-name").textContent = "No spell found";
                return;
            }
            // Clear existing spell cards
            document.getElementById(toWriteTo).innerHTML = "";
            const spellCard = document.createElement("div");
            spellCard.classList.add("spell-card");
            spellCard.innerHTML = `
                    <div class="spell-name"><strong>${spells.Spell}</strong></div>
                    <div class="spell-level"><strong>${spells.Level}</strong></div>
                    <div class="spell-detail"><strong>Source:</strong> <span>${spells.Source || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Casting Time:</strong> <span>${spells['Casting Time'] || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Range:</strong> <span>${spells.Range || "N/A"}</span></div>
                    <div class="spell-detail"><strong>School:</strong> <span>${spells.School || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Components:</strong> <span>${spells.Components || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Duration:</strong> <span>${spells.Duration || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Description:</strong> <span>${spells.Description || "N/A"}</span></div>
                    <div class="spell-detail"><strong>Classes:</strong> <span>${getSpellLists(spells)}</span></div><br>
                `;
            // Append the new spell card to the container
            document.getElementById(toWriteTo).appendChild(spellCard);
        }
        catch (error) {
            console.error("Error fetching spell:", error);
        }
    });
}
function SpellFilter() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let form = document.getElementById("SpellFilterOptions");
        let formData = {};
        for (let i = 0; i < form.elements.length; i++) {
            let element = form.elements[i];
            if (element.type !== "button") {
                formData[element.name] = (_a = element.value) !== null && _a !== void 0 ? _a : " ";
            }
        }
        let jsonData = JSON.stringify(formData);
        console.log(jsonData);
        try {
            const spells = yield window.api.FilterSpells(formData);
            if (!spells || spells.error) {
                document.getElementById("spell-name").textContent = "No spell found";
                return;
            }
            console.log(spells);
            spellLister(spells);
        }
        catch (error) {
            console.error("Error fetching spell:", error);
            document.getElementById("errorlabel").textContent = "Error loading spell";
        }
    });
}
const filterOptions = {
    Level: ["", "Cantrip", "1st Level", "2nd Level", "3rd Level", "4th Level", "5th Level", "6th Level", "7th Level", "8th Level", "9th Level"],
    School: ["", "Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"],
    Class: ["", "Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"]
};
// Function to generate select options
function populateSelectOptions() {
    for (const [key, values] of Object.entries(filterOptions)) {
        const select = document.getElementById(key);
        values.forEach(value => {
            const option = document.createElement("option");
            option.value = value.replace(/ Level$/, "").toLowerCase(); // Normalize values
            option.textContent = value || "All"; // Display "All" text if value is empty
            select.appendChild(option);
        });
    }
}
function SpellFilterReset() {
    document.getElementById("SpellFilterOptions").reset();
    SpellFilter();
}
// Populate select elements on page load
document.addEventListener("DOMContentLoaded", populateSelectOptions);
