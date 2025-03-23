import sqlite3
import pandas as pd
import webview



class SpellAPI:

    def spellFilter(self, spell):

        conn = sqlite3.connect("Spells.db")  # Ensure this is your database
        cursor = conn.cursor()

        columns = cursor.execute("PRAGMA table_info(spells);")
        spell_columns = [col[1] for col in columns if col[1].startswith("Spell_lists")]

        # Construct the WHERE clause to check if any of the columns contain "Druid"
        search_clause = " OR ".join([f"LOWER({col}) LIKE '%" + spell.spell_list + "%' " for col in spell_columns])
        search_clause = f"({search_clause})AND LOWER(Level) LIKE '%" +spell.level + "%'"
        search_clause = f"({search_clause})AND LOWER(Spell) LIKE ''%" + spell.spell + "%''"
        search_clause = f"({search_clause})AND LOWER(Spell) LIKE ''%" + spell.source + "%''"
        search_clause = f"({search_clause})AND LOWER(Spell) LIKE ''%" + spell.school + "%''"

        # Construct the SQL query to select rows where any of the "Spell lists" columns contain "Druid"
        query = f"SELECT * FROM Spells WHERE {search_clause};"


        df = pd.read_sql(query, conn)
        conn.close()
        print(df)
        return df.to_dict('records')


    def list_Spells(self):
        conn = sqlite3.connect("Spells.db")  # Ensure this is your database
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("SELECT Spell FROM Spells;")
        spell = cursor.fetchall()

        conn.close()
        if spell:
            return [dict(n) for n in spell]
        else:
            return [{'error':"No Spells Found"}]

    def search_spell(self, spell,amountOfSpells):
        conn = sqlite3.connect("spells.db")  # Ensure this is your database
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Spells WHERE LOWER(spell) LIKE '%" + spell + "%'")
        spell = cursor.fetchall()

        conn.close()
        if spell:
            if amountOfSpells == 1:
                return [dict(spell[0])]
            elif amountOfSpells == -1:
                return [dict(n) for n in spell]
        else:
            return [{'error':"No Spells Found"}]

    def get_spell(self):
        """ Fetches a random spell from SQLite and returns it. """
        conn = sqlite3.connect("spells.db")  # Ensure this is your database
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Spells ORDER BY RANDOM() LIMIT 1;")
        spell = cursor.fetchone()

        conn.close()

        if spell:
            return {
                "Spell": spell[0],
                "range": spell[1],
                "components": spell[2],
                "duration": spell[3]
            }

        return {"error": "No spell found"}


if __name__ == '__main__':
    api = SpellAPI()
    webview.create_window("Spell Display", "spellDisplayV2.html", js_api=api)
    webview.start(debug=False)


