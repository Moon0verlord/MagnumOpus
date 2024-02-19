import sqlite3
import random
import string

# Function to generate a random password
def generate_password():
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(10))

# Function to generate random data
def generate_random_data(num_entries, usernames, mail_servers, domains, names):
    data = []
    for i in range(num_entries):
        username = random.choice(usernames)
        mail_server = random.choice(mail_servers)
        domain = random.choice(domains)
        name = random.choice(names)
        email = f"{username}@{mail_server}.{domain}"
        password = generate_password()
        data.append((i+1, name, email, password))
    return data

# Function to generate random data for Charging_ports table
def generate_charging_ports_data(num_entries):
    data = []
    for i in range(num_entries):
        port_number = i + 1
        charging_speed = random.randint(1, 100)
        status = random.choice(["Charging", "Available","Out of order",])
        data.append((i+1, port_number, charging_speed, status))
    return data

# Connect to SQLite database
conn = sqlite3.connect('Main.db')
cursor = conn.cursor()


# Define arrays for customization
usernames = ["Joe", "Donald", "Joseph", "Klaus ", "obamna","Xi","Rutte","Jeffery"]
mail_servers = ["clintonemail", "BidenCrimeFamily", "ClintonCrimeFamily","Juice","whitehouse"]
domains = ["gov", "net", "org", "com","us"]
names = ["Joe Rogan", "Donald Trump", "Joseph Biden", "Klaus Schwab", "Christine Lagarde","Xi Jinping","Mark Rutte","Jeffery Epstein"]

# Generate and insert random data into Users table
num_entries = 10  # Change this to the desired number of entries
num_charging_ports = 10
charging_ports_data = generate_charging_ports_data(num_charging_ports)
cursor.executemany('INSERT INTO Charging_ports VALUES (?, ?, ?, ?)', charging_ports_data)
user_data = generate_random_data(num_entries, usernames, mail_servers, domains, names)
cursor.executemany('INSERT INTO Users VALUES (?, ?, ?, ?)', user_data)

# Commit changes and close connection
conn.commit()
conn.close()

print("Data inserted successfully.")
