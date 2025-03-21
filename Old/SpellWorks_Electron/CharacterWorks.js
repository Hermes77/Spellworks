// Purpose: This file is used to fetch the character.json file and display the character information in the character sheet.

function calculateScore(value) {
  return Math.floor((value - 10) / 2);
}

const ScoreModifiers = {};

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
let dataVar;
fetch("character.json")
  .then((response) => response.json()) // Parse JSON
  .then((data) => {
     dataVar = data;
  }) 
  .catch((error) => console.error("Error fetching JSON:", error));

for (const [key, value] of Object.entries(dataVar.characterinfo)) {
  let infoentry = document.createElement("div");
  infoentry.setAttribute("class", "characterinfoentry");
  infoentry.innerHTML = `
                                    <span class="characterinfokey">${key.replace(
                                      /_/g,
                                      " "
                                    )}</span>
                                    <span class="characterinfovalue">${value}</span>`;
  const characterBasicInfo = document.getElementById("CharacterBasicInfo");
  if (characterBasicInfo) {
    characterBasicInfo.appendChild(infoentry);
  }
}
for (const [key, value] of Object.entries(dataVar.abilities)) {
  let valueentry = document.createElement("div");
  valueentry.setAttribute("class", "charactervalueentry");
  let tempMOD = calculateScore(value);
  ScoreModifiers[key.substring(0, 3)] = tempMOD;
  valueentry.innerHTML = `
            <span class="characterscorekey">${key.replace(/_/g, " ")}: </span>
            <span class="characterscorevalue" id="ScoreRAW">${value}</span>
            <span class="characterScorevalue" id="ScoreMOD">+${tempMOD}</span>`;

  const characterStats = document.getElementById("CharacterStats");
  if (characterStats) {
    characterStats.appendChild(valueentry);
  }
}
for (const [skill, ability] of Object.entries(skills)) {
  const skillentry = document.createElement("div");
  skillentry.setAttribute("class", "characterskillentry");

  const isProficient = dataVar.proficiencies.includes(skill);
  const filledDot = isProficient ? "●" : "○"; // Filled if proficient

  const skillScore =
    ScoreModifiers[ability.substring(0, 3)] + (isProficient ? 2 : 0);

  skillentry.innerHTML = `
                                    <span class="characterproficent">${filledDot}</span>
                                    <span class="characterskillkey">${
                                      skill +
                                      "(" +
                                      ability.substring(0, 3) +
                                      ")"
                                    }</span>
                                    <span class="characterskillvalue">${skillScore}</span>`;
  const characterSkills = document.getElementById("CharacterSkills");
  if (characterSkills) {
    characterSkills.appendChild(skillentry);
  }
}
