interface Spell {
  Spell: string;
  Level: number;
  Range: string;
  Source: string;
  School: string;
  Components: string;
  Duration: string;
  Description: string;
  "Casting Time": string;
  [key: string]: any;
}

interface APIResponse {
  error?: boolean;
  [key: string]: any;
}

interface Window {
  api: {
    getEntries: () => Promise<Spell[] | APIResponse>;
    SearchSpellsCard: (spellSearch: string) => Promise<any>;
    FilterSpells: (formData: Record<string, string>) => Promise<Spell[]>;
  };
}

function spellLister(spells: Spell[]): void {
  // Clear existing spell cards
  const spellContainer = document.getElementById("spell-container");
  if (spellContainer) {
    spellContainer.innerHTML = "";
  }

  const header = document.createElement("div");
  header.classList.add("spell-header");
  header.innerHTML = `<span class="spell-name-list">Spell</span><span class="spell-info-list">Level</span><span class="spell-info-list">Range</span>`;
  if (spellContainer) {
    spellContainer.appendChild(header);
  }

  spells.forEach((spell: { Spell: string; Level: number; Range: string }) => {
    const spellentry = document.createElement("div");
    spellentry.classList.add("spell-entry");
    spellentry.setAttribute(
      "onclick",
      `search_spell(event, "${spell.Spell}", 'SpellDisplay')`
    );

    spellentry.innerHTML = `
                       <span class="spell-name-list">${spell.Spell}</span>
                       <span class="spell-info-list">${spell.Level}</span>
                       <span class="spell-info-list">${spell.Range}</span>`;

    // Append the new spell card to the container
    if (spellContainer) {
      spellContainer.appendChild(spellentry);
    }
  });
}

async function list_spell(): Promise<void> {
  try {
    const spells: Spell[] | APIResponse = await window.api.getEntries();

    if (!spells || (spells as APIResponse).error) {
      const spellNameElement = document.getElementById("spell-name");
      if (spellNameElement) {
        spellNameElement.textContent = "No spell found";
      }
      return;
    }

    spellLister(spells as Spell[]);
  } catch (error) {
    console.error("Error fetching spell:", error);
    const errorLabelElement = document.getElementById("errorlabel");
    if (errorLabelElement) {
      errorLabelElement.textContent = "Error loading spell";
    }
  }
}
list_spell();

function getSpellLists(spell: { [key: string]: string | null }): string[] {
  const Classes: string[] = [];
  for (let key in spell) {
    if (key.includes("Spell_lists")) {
      if (spell[key] !== null) {
        Classes.push(spell[key] as string);
      }
    }
  }
  console.log(Classes);
  return Classes;
}

async function search_spell(
  event: Event,
  spellSearch: string,
  toWriteTo: string
): Promise<void> {
  try {
    event.preventDefault();

    const spells: Spell | APIResponse = (await window.api.SearchSpellsCard(
      spellSearch
    )) as APIResponse; // Call the API to search for the spell

    if (!spells || spells.error) {
      const spellNameElement = document.getElementById("spell-name");
      if (spellNameElement) {
        spellNameElement.textContent = "No spell found";
      }
      return;
    }

    const container = document.getElementById(toWriteTo);
    if (container) {
      container.innerHTML = "";

      const spellCard = document.createElement("div");
      spellCard.classList.add("spell-card");

      spellCard.innerHTML = `
                    <div class="spell-name"><strong>${
                      (spells as Spell).Spell
                    }</strong></div>
                    <div class="spell-level"><strong>${
                      (spells as Spell).Level
                    }</strong></div>
                    <div class="spell-detail"><strong>Source:</strong> <span>${
                      (spells as Spell).Source || "N/A"
                    }</span></div>
                    <div class="spell-detail"><strong>Casting Time:</strong> <span>${
                      (spells as Spell)["Casting Time"] || "N/A"
                    }</span></div>
                    <div class="spell-detail"><strong>Range:</strong> <span>${
                      (spells as Spell).Range || "N/A"
                    }</span></div>
                    <div class="spell-detail"><strong>School:</strong> <span>${
                      (spells as Spell).School || "N/A"
                    }</span></div>
                    <div class="spell-detail"><strong>Components:</strong> <span>${
                      (spells as Spell).Components || "N/A"
                    }</span></div>
                    <div class="spell-detail"><strong>Duration:</strong> <span>${
                      (spells as Spell).Duration || "N/A"
                    }</span></div>
                    <div class="spell-detail"><strong>Description:</strong> <span>${
                      (spells as Spell).Description || "N/A"
                    }</span></div>
                    <div class="spell-detail"><strong>Classes:</strong> <span>${getSpellLists(
                      spells as Spell
                    )}</span></div><br>
                `;

      // Append the new spell card to the container
      container.appendChild(spellCard);
    }
  } catch (error) {
    console.error("Error fetching spell:", error);
  }
}
async function SpellFilter() {
  let form = document.getElementById("SpellFilterOptions");
  let formData: any = {};
  if (form && form instanceof HTMLFormElement) {
    for (let i = 0; i < form.elements.length; i++) {
      let element = form.elements[i] as HTMLInputElement;
        if (element.type !== "button") {
            formData[String(element.name)] = element.value ?? " ";
        }
    }
    console.log(formData);
    let jsonData = JSON.stringify(formData);
    console.log(jsonData);
    try {
      const spells = await window.api.FilterSpells(formData);

      if (!spells || (spells as APIResponse).error) {
        const spellNameElement = document.getElementById("spell-name");
        if (spellNameElement) {
          spellNameElement.textContent = "No spell found";
        }
        return;
      }
      console.log(spells);

      spellLister(spells);
    } catch (error) {
      console.error("Error fetching spell:", error);
      const errorLabelElement = document.getElementById("errorlabel");
      if (errorLabelElement) {
        errorLabelElement.textContent = "Error loading spell";
      }
    }
  }
}

const filterOptions = {
  Level: [
    "",
    "Cantrip",
    "1st Level",
    "2nd Level",
    "3rd Level",
    "4th Level",
    "5th Level",
    "6th Level",
    "7th Level",
    "8th Level",
    "9th Level",
  ],
  School: [
    "",
    "Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Evocation",
    "Illusion",
    "Necromancy",
    "Transmutation",
  ],
  Class: [
    "",
    "Bard",
    "Cleric",
    "Druid",
    "Paladin",
    "Ranger",
    "Sorcerer",
    "Warlock",
    "Wizard",
  ],
};

// Function to generate select options
function populateSelectOptions() {
  for (const [key, values] of Object.entries(filterOptions)) {
    const select = document.getElementById(key);
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value.replace(/ Level$/, "").toLowerCase(); // Normalize values
      option.textContent = value || "All"; // Display "All" text if value is empty
      if (select) {
        select.appendChild(option);
      }
    });
  }
}

function SpellFilterReset() {
  const formElement = document.getElementById("SpellFilterOptions");
  if (formElement && formElement instanceof HTMLFormElement) {
    formElement.reset();
  }
  SpellFilter();
}

// Populate select elements on page load
document.addEventListener("DOMContentLoaded", populateSelectOptions);
