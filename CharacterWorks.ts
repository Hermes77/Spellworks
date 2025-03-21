// Purpose: This file is used to fetch the character.json file and display the character information in the character sheet.

function calculateScore(value: number) {
  return Math.floor((value - 10) / 2);
}

var ScoreModifiers: Map<string, number> = new Map<string, number>();

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



function DisplayCharData<T>(
  data: Record<string, T>,
  parentId: string,
  entryClass: string,
  generateInnerHTML: (key: string, value: T) => string,
  extraProcessing?: (key: string, value: T, element: HTMLDivElement) => void
) {
  const parentElement = document.getElementById(parentId);
  if (!parentElement) return;

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

async function fetchDisplayCharData() {
  try {
      let data;
      if (window.json && typeof window.json.fetchCharacterJSON === "function") {
        data = await window.json.fetchCharacterJSON();
      } else {
        throw new Error("fetchCharacterJSON is not defined on window.json");
      }
    if (!data) {
      return;
    }
    DisplayCharData(
      data.characterinfo,
      "CharacterBasicInfo",
      "characterinfoentry",
      (key, value) => `
    <span class="characterinfokey">${key.replace(/_/g, " ")}</span>
    <span class="characterinfovalue">${value}</span>`
    );
    DisplayCharData(
      data.abilities,
      "CharacterStats",
      "charactervalueentry",
      (key, value) => {
        const tempMOD: number = calculateScore(Number(value));
        ScoreModifiers.set(key.substring(0, 3), tempMOD);
        return `
        <span class="characterscorekey">${key.replace(/_/g, " ")}: </span>
        <span class="characterscorevalue" id="ScoreRAW">${value}</span>
        <span class="characterScorevalue" id="ScoreMOD">+${tempMOD}</span>`;
      }
    );
    DisplayCharData(
      skills as Record<string, string>,
      "CharacterSkills",
      "characterskillentry",
      (skill, ability) => {
        const isProficient = data.proficiencies.includes(skill);
        const filledDot = isProficient ? "●" : "○";
        const skillScore: number =
          ScoreModifiers.get(ability.substring(0, 3)) ?? 0;
        const skillScoreCalc = skillScore + (isProficient ? 2 : 0);

        return `
        <span class="characterproficent">${filledDot}</span>
        <span class="characterskillkey">${skill} (${ability.substring(
          0,
          3
        )})</span>
        <span class="characterskillvalue">+${skillScoreCalc}</span>`;
      }
    );
  } catch (error) {
    console.error("Error displaying data:", error);
  }
}

fetchDisplayCharData();

