import fs from 'fs'
import { character } from './Icharacter';


declare global {
    interface Window {
        json: {
            fetchCharacterJSON: () => Promise<any | Response>;
            CharacterClass: { getInstance: () => void; getData: any; };
        }
    }
}


class CharacterClass{ //TODO Make this acessable from other files
  private static instance: CharacterClass;
  static data: character;

  private constructor() {
    try {
      const response = JSON.parse(fs.readFileSync("character.json", "utf8"));
      CharacterClass.data = response as character;
    } catch (error) {
      console.error("Error fetching JSON:", error);
      CharacterClass.data = {} as character;
    }
  }

  static getInstance(): CharacterClass {
    if (!CharacterClass.instance) {
      CharacterClass.instance = new CharacterClass();
    }
    return CharacterClass.instance;
  }

  static set setData(newCharacterData: character) {
    CharacterClass.data = newCharacterData;
  }

  static get getData() {
    return CharacterClass.data;
  }
  static set setClassData(newClassData: string) {
    CharacterClass.data.characterinfo.Class = newClassData;
  }
}

CharacterClass.getInstance();

export async function fetchCharacterJSON(callback: (CharacterData: any) => void): Promise<void> {
  try {
    const response = JSON.parse(fs.readFileSync("character.json", "utf8"));
    callback(response);
  } catch (error) {
    console.error("Error fetching JSON:", error);
    callback({});
  }
}

  module.exports = { fetchCharacterJSON, CharacterClass };