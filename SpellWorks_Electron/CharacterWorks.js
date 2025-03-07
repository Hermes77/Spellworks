function calculateScore(value) {
    return Math.floor((value - 10) / 2);
}

const ScoreModifiers= {};


fetch('character.json')
    .then(response => response.json()) // Parse JSON
    .then(data => {
        for(const [key, value] of Object.entries(data.characterinfo)) {
            const infoentry = document.createElement("div"); 
            infoentry.setAttribute("class", "characterinfoentry");
            infoentry.innerHTML = `
                                        <span class="characterinfokey">${key.replace(/_/g, ' ')}</span>
                                        <span class="characterinfovalue">${value}</span>`;
            document.getElementById("CharacterBasicInfo").appendChild(infoentry);
        }
        for(const [key, value] of Object.entries(data.abilities)) {
            const valueentry = document.createElement("div"); 
            valueentry.setAttribute("class", "charactervalueentry");
            tempMOD = calculateScore(value);
            ScoreModifiers[key.substring(0,3)]=(tempMOD);
            valueentry.innerHTML = `
                <span class="characterscorekey">${key.replace(/_/g, ' ')}: </span>
                <span class="characterscorevalue" id="ScoreRAW">${value}</span>
                <span class="characterScorevalue" id="ScoreMOD">+${tempMOD}</span>`;

            document.getElementById("CharacterStats").appendChild(valueentry);
        }

    }) 
    .catch(error => console.error('Error fetching JSON:', error));


