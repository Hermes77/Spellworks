import fs from 'fs'


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