
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

  async function fetchSpellData(spellSearch: string): Promise<Spell | null> {
    try {
      const response: Spell | Response = await window.db.SearchSpellsCard(spellSearch);
    console.log(response);
      return response as Spell;
    } catch (error) {
      console.error("Error fetching spell:", error);
      return null;
    }
  }