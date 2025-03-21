"use strict";
// Purpose: This file is used to fetch the character.json file and display the character information in the character sheet.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function calculateScore(value) {
    return Math.floor((value - 10) / 2);
}
var ScoreModifiers = new Map();
const skills = {
    Acrobatics: "Dexterity",
    "Animal Handling": "Wisdom",
    Arcana: "Intelligence",
    Athletics: "Strength",
    Deception: "Charisma",
    History: "Intelligence",
    Insight: "Wisdom",
    Intimidation: "Charisma",
    Investigation: "Intelligence",
    Medicine: "Wisdom",
    Nature: "Intelligence",
    Perception: "Wisdom",
    Performance: "Charisma",
    Persuasion: "Charisma",
    Religion: "Intelligence",
    "Sleight of Hand": "Dexterity",
    Stealth: "Dexterity",
    Survival: "Wisdom",
};
function fetchCharacterData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("character.json");
            const data = response.json();
            console.log(data);
            return data;
        }
        catch (error) {
            console.error("Error fetching JSON:", error);
            return null;
        }
    });
}
function DisplayCharData(data, parentId, entryClass, generateInnerHTML, extraProcessing) {
    const parentElement = document.getElementById(parentId);
    if (!parentElement)
        return;
    for (const [key, value] of Object.entries(data)) {
        const entry = document.createElement("div");
        entry.setAttribute("class", entryClass);
        entry.innerHTML = generateInnerHTML(key, value);
        if (extraProcessing) {
            extraProcessing(key, value, entry);
        }
        parentElement.appendChild(entry);
    }
}
function fetchDisplayCharData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fetchCharacterData();
            if (!data) {
                return;
            }
            DisplayCharData(data.characterinfo, "CharacterBasicInfo", "characterinfoentry", (key, value) => `
    <span class="characterinfokey">${key.replace(/_/g, " ")}</span>
    <span class="characterinfovalue">${value}</span>`);
            DisplayCharData(data.abilities, "CharacterStats", "charactervalueentry", (key, value) => {
                const tempMOD = calculateScore(Number(value));
                ScoreModifiers.set(key.substring(0, 3), tempMOD);
                return `
        <span class="characterscorekey">${key.replace(/_/g, " ")}: </span>
        <span class="characterscorevalue" id="ScoreRAW">${value}</span>
        <span class="characterScorevalue" id="ScoreMOD">+${tempMOD}</span>`;
            });
            DisplayCharData(skills, "CharacterSkills", "characterskillentry", (skill, ability) => {
                var _a;
                const isProficient = data.proficiencies.includes(skill);
                const filledDot = isProficient ? "●" : "○";
                const skillScore = (_a = ScoreModifiers.get(ability.substring(0, 3))) !== null && _a !== void 0 ? _a : 0;
                const skillScoreCalc = skillScore + (isProficient ? 2 : 0);
                return `
        <span class="characterproficent">${filledDot}</span>
        <span class="characterskillkey">${skill} (${ability.substring(0, 3)})</span>
        <span class="characterskillvalue">+${skillScoreCalc}</span>`;
            });
        }
        catch (error) {
            console.error("Error displaying data:", error);
        }
    });
}
fetchDisplayCharData();
