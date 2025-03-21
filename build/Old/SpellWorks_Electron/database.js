"use strict";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../Spells.db", (err) => {
    if (err) {
        console.error("Database connection error:", err);
    }
    else {
        console.log("Connected to SQLite database.");
    }
});
function getEntries(callback) {
    db.all('SELECT Spell,Level,Range FROM Spells', [], (err, rows) => {
        if (err) {
            console.error("Error fetching entries:", err);
            callback([]);
        }
        else {
            callback(rows);
        }
    });
}
function FilterSpells(filterDict, callback) {
    db.all("PRAGMA table_info(spells);", [], (err, columns) => {
        if (err) {
            console.error("Error fetching table info:", err);
            callback([]); // Ensure callback is called even on error
            return;
        }
        const columnNames = columns.map(col => col.name);
        const spellColumns = columnNames.filter(col => col.startsWith("Spell_lists"));
        let searchClause = spellColumns.map(col => `LOWER(${col}) LIKE '%${filterDict.Class}%'`).join(" OR ");
        searchClause = `(${searchClause}) AND LOWER(Level) LIKE '%${filterDict.Level}%'`;
        searchClause = `(${searchClause}) AND LOWER(Spell) LIKE '%${filterDict.Spell}%'`;
        searchClause = `(${searchClause}) AND LOWER(School) LIKE '%${filterDict.School}%'`;
        db.all(`SELECT Spell,Level,Range FROM Spells WHERE ${searchClause}`, [], (err, rows) => {
            if (err) {
                console.error("Error fetching entries:", err);
                callback([]);
            }
            else {
                callback(rows);
            }
        });
    });
}
function SearchSpellsCard(spell, callback) {
    db.get("SELECT * FROM Spells WHERE LOWER(spell) LIKE ?", ['%' + spell + '%'], (err, row) => {
        if (err) {
            console.error("Error fetching entries:", err);
            callback([]);
        }
        else {
            callback(row);
        }
    });
}
module.exports = { getEntries, FilterSpells, SearchSpellsCard };
