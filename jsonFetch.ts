import fs from 'fs'
//TODO List
// Put the entire json into a class that can be accessed by the entire program
// Make the class a global variable that can be accessed by the entire program
// put the fetch and store functions inside class

declare global {
    interface Window {
        json: {
            fetchCharacterJSON: () => Promise< any | Response>;
        }
    }
}

export async function fetchCharacterJSON(callback: (CharacterData: any) => void): Promise<void> {
  try {
    const response = JSON.parse(fs.readFileSync("character.json", "utf8"));
    callback(response);
  } catch (error) {
    console.error("Error fetching JSON:", error);
    callback({});
  }
}

  module.exports = { fetchCharacterJSON };