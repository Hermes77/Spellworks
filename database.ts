const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("Spells.db", (err: any) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

declare global {
interface Spell {
  Spell: string;
  Level: number;
  Range: string;
  Source: string;
  School: string;
  Components: string;
  Duration: string;
  Description: string;
  "Casting Time": string;
  [key: string]: any;
}
  interface Window {
      db: {
        getEntries: () => Promise<Spell[] | Response>;
        SearchSpellsCard: (spellSearch: string) => Promise<any>;
        FilterSpells: (formData: Record<string, string>) => Promise<Spell[]>;
      }
    }
  
}

export function getEntries(callback: (rows: Spell[]) => void): void {
  db.all(
    "SELECT Spell,Level,Range FROM Spells",
    [],
    (err: Error | null, rows: Spell[]) => {
      if (err) {
        console.error("Error fetching entries:", err);
        callback([]);
      } else {
        callback(rows);
      }
    }
  );
}

interface ColumnInfo {
  name: string;
}

export function FilterSpells(
  filterDict: Spell,
  callback: (rows: Spell[]) => void
): void {
  db.all(
    "PRAGMA table_info(spells);",
    [],
    (err: Error | null, columns: ColumnInfo[]) => {
      if (err) {
        console.error("Error fetching table info:", err);
        callback([]);
        return;
      }

      const columnNames = columns.map((col) => col.name);
      const spellColumns = columnNames.filter((col) =>
        col.startsWith("Spell_lists")
      );

      let searchClause = spellColumns
        .map((col) => `LOWER(${col}) LIKE '%${filterDict.Class}%'`)
        .join(" OR ");
      searchClause = `(${searchClause}) AND LOWER(Level) LIKE '%${filterDict.Level}%'`;
      searchClause = `(${searchClause}) AND LOWER(Spell) LIKE '%${filterDict.Spell}%'`;
      searchClause = `(${searchClause}) AND LOWER(School) LIKE '%${filterDict.School}%'`;

      db.all(
        `SELECT Spell,Level,Range FROM Spells WHERE ${searchClause}`,
        [],
        (err: Error | null, rows: Spell[]) => {
          if (err) {
            console.error("Error fetching entries:", err);
            callback([]);
          } else {
            callback(rows);
          }
        }
      );
    }
  );
}

export function SearchSpellsCard(
  spell: string,
  callback: (row: Spell | null) => void
): void {
  db.get(
    "SELECT * FROM Spells WHERE LOWER(spell) LIKE ?",
    [spell],
    (err: Error | null, row: Spell | null) => {
      if (err) {
        console.error("Error fetching entries:", err);
        callback(null);
      } else {
        callback(row);
      }
    }
  );
}


module.exports = { getEntries, FilterSpells, SearchSpellsCard };
