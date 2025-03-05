const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../Spells.db", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

function getEntries(callback){
    db.all("SELECT Spell FROM Spells", [], (err, rows) => {
        if (err) {
          console.error("Error fetching entries:", err);
          callback([]);
        } else {
          callback(rows);
        }
      });
    }

function SearchSpellsCard(spell,callback){
    db.all("SELECT * FROM Spells WHERE LOWER(spell) LIKE '%" + spell + "%'", [], (err, rows) => {
        if (err) {
          console.error("Error fetching entries:", err);
          callback([]);
        } else {
          callback(rows);
        }
    });

}


module.exports = { getEntries,SearchSpells};