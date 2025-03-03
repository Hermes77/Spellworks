import sqlite3

import pandas as pd

# Load the CSV file into a pandas DataFrame
csv_file = 'SpellData.csv'  # Replace with your CSV file path
df = pd.read_csv(csv_file)

# Connect to the SQLite database (it will create the database if it doesn't exist)
db_file = 'Spells.db'  # Replace with your SQLite database file
conn = sqlite3.connect(db_file)
cursor = conn.cursor()

# Generate the CREATE TABLE statement dynamically based on the CSV columns
create_table_sql = "CREATE TABLE IF NOT EXISTS Spells (\n"

# Loop through each column to determine the data type and create the column definition
for column in df.columns:
    if df[column].dtype == 'object':  # If the column is a string (text data)
        data_type = 'TEXT'
    elif df[column].dtype == 'int64':  # If the column is an integer
        data_type = 'INTEGER'
    elif df[column].dtype == 'float64':  # If the column is a float
        data_type = 'REAL'
    else:
        data_type = 'TEXT'  # Default to TEXT if unsure

    create_table_sql += f"    {column} {data_type},\n"

# Remove the trailing comma and finalize the CREATE TABLE statement
create_table_sql = create_table_sql.rstrip(',\n') + "\n);"

# Print the generated CREATE TABLE statement (optional)
print(create_table_sql)

# Execute the CREATE TABLE statement
cursor.execute(create_table_sql)

# Insert data from the CSV into the Spells table
df.to_sql('Spells', conn, if_exists='replace', index=False)

# Commit changes and close the connection
conn.commit()
conn.close()

print(f"CSV data from {csv_file} has been successfully imported into the database.")
