
async function fetchCharSpellData() {
    try {
      const spellContainer = document.getElementById("CharacterSpellInfo");
      const charData = await window.json.fetchCharacterJSON() ;
      for(const spell of charData.spells){
        const spellentry = document.createElement("div");
        spellentry.classList.add("spell-entry");
        const fullSpell = await fetchSpellData(spell);
        if (fullSpell) {
          spellentry.innerHTML = `
                         <span class="spell-name-list">${fullSpell.Spell}</span>
                         <span class="spell-info-list">${fullSpell.Level}</span>
                         <span class="spell-info-list">${fullSpell.Range}</span>`;
        } else {
          console.warn(`Spell data not found for: ${spell}`);
        }
        spellContainer?.appendChild(spellentry);
  
      }
    } catch (error) {
      console.error("Error displaying data:", error);
    }
  };
  fetchCharSpellData();

//TODO move Function
// I think this function should be a wrapper function for SearchSpellsCard in database.ts

  async function fetchSpellData(spellSearch: string): Promise<Spell | null> { 
    try {
      const response: Spell | Response = await window.db.SearchSpellsCard(spellSearch);
      return response as Spell;
    } catch (error) {
      console.error("Error fetching spell:", error);
      return null;
    }
  }