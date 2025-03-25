export interface character {
    characterinfo: {
        Player_Name: string;
        Character_Name: string;
        Class: string;
        Level: number;
        Race: string;
        Alignment: string;
        Background: string;
        Experience: number;
    };
    abilities: {
        Strength: number;
        Dexterity: number;
        Constitution: number;
        Intelligence: number;
        Wisdom: number;
        Charisma: number;
    };
    hit_points: number;
    armor_class: number;
    walkingspeed: number;
    proficiencies: string[];
    equipment: string[];
    spells?: string[];
}