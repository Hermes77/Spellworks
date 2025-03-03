import sqlite3

import webview


class SpellAPI:
    """ This class provides spell data to the web UI via PyWebview. """
    def search_spell(self, spell):
        conn = sqlite3.connect("spells.db")  # Ensure this is your database
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Spells WHERE LOWER(spell) LIKE '%" + spell + "%'")
        spell = cursor.fetchall()

        conn.close()
        if spell:
            return [dict(n) for n in spell]
        else:
            return [{f"No Spells Found with the name {spell}"}]

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


# Create an API instance
api = SpellAPI()

# pprint(api.search_spell("thunder"))

# Start PyWebview with API access
webview.create_window("Spell Display", "spellDisplay.html", js_api=api)
webview.start()


