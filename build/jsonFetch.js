"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterClass = void 0;
exports.fetchCharacterJSON = fetchCharacterJSON;
const fs_1 = __importDefault(require("fs"));
class CharacterClass {
    constructor() {
        try {
            const response = JSON.parse(fs_1.default.readFileSync("character.json", "utf8"));
            CharacterClass.data = response;
        }
        catch (error) {
            console.error("Error fetching JSON:", error);
            CharacterClass.data = {};
        }
    }
    static getInstance() {
        if (!CharacterClass.instance) {
            CharacterClass.instance = new CharacterClass();
        }
        return CharacterClass.instance;
    }
    static set setData(newCharacterData) {
        CharacterClass.data = newCharacterData;
    }
    static get getData() {
        return CharacterClass.data;
    }
    static set setClassData(newClassData) {
        CharacterClass.data.characterinfo.Class = newClassData;
    }
}
exports.CharacterClass = CharacterClass;
CharacterClass.getInstance();
function fetchCharacterJSON(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = JSON.parse(fs_1.default.readFileSync("character.json", "utf8"));
            callback(response);
        }
        catch (error) {
            console.error("Error fetching JSON:", error);
            callback({});
        }
    });
}
module.exports = { fetchCharacterJSON, CharacterClass };
