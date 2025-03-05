import sqlite3
import textwrap

import pandas as pd

with sqlite3.connect('../Spells.db') as connection:
    cursor = connection.cursor()

    columns = cursor.execute("PRAGMA table_info(spells);")
    spell_columns = [col[1] for col in columns if col[1].startswith("Spell_lists")]

    # Construct the WHERE clause to check if any of the columns contain "Druid"
    class_clause = " OR ".join([f"LOWER({col}) LIKE '%Druid%' " for col in spell_columns])
    Level_clause = f" ({class_clause})AND LOWER(Level) LIKE '%cantrip%'"
    Spell_clause = f"({Level_clause})AND LOWER(Spell) LIKE '%Thorn%'"


     # Construct the SQL query to select rows where any of the "Spell lists" columns contain "Druid"
    query = f"SELECT * FROM Spells WHERE {Spell_clause};"


    df = pd.read_sql(query, connection)
    # df.sort_values(by=["Level"], inplace=True)
    print(df.to_markdown())

# Function to print a "card" for each spell
def print_spell_card(row):
    print("="*40)
    print(f"Spell Name: {row['Spell']}")
    print("-"*40)
    print(f"Level: {row['Level']}       School: {row['School']}")
    print(f"Range: {row['Range']}")
    print(f"Casting Time: {row['Casting Time']}")
    print(f"Components: {row['Components']}")
    print(f"Duration: {row['Duration']}")
    print("-"*40)
    wrapped_description = textwrap.fill(row['Description'], width=50)
    print(f"Description: \n{wrapped_description}")
    print("="*40)
    print()



# Loop through the DataFrame and print each spell card
for _, row in df.iterrows():
    print_spell_card(row)
