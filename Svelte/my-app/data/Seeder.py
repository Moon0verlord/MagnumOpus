import sqlite3
import random
import string
import uuid

# List of names, surnames, email domains and adresses
names = ['John', 'Jane', 'Robert', 'Alice', 'Tom', 'Emma', 'Michael', 'Sarah', 'David', 'Emily']
surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson']
domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'protonmail.com']
addresses = ['123 Main St', '124 Main St', '125 Main St']

# Function to generate a random name
def generate_name():
    return random.choice(names) + ' ' + random.choice(surnames)

# Function to generate a random email
def generate_email():
    return generate_string(10).lower() + '@' + random.choice(domains)

# Function to generate a random string
def generate_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

# Function to generate a port ID
def generate_port_id(port_number):
    return 'NL-' + generate_string(5).upper() + '-' + generate_string(5).upper() + '-' + str(port_number)

# Function to generate the second port ID
def generate_second_port_id(first_port_id):
    parts = first_port_id.split('-')
    parts[-1] = str(int(parts[-1]) + 1)  # Increment the last part
    second_port_id = '-'.join(parts)
    return second_port_id  # The string is already capitalized

# Function to generate emi3Id from portId
def generate_emi3id(port_id):
    parts = port_id.split('-')
    emi3id = ''.join(parts[:-1]) + '*' + parts[-1]
    return emi3id

# Function to generate a status
def generate_status():
    return 'available'

# Function to generate a random priority
def generate_priority():
    return random.choice(['high', 'medium', 'low'])

# Function to generate a random boolean
def generate_bool():
    return random.choice([True, False])

# Function to generate a static street address
def generate_address():
    return random.choice(addresses)

# Connect to SQLite database
conn = sqlite3.connect('Main.db')
cursor = conn.cursor()

# Delete all records from the tables
cursor.execute('DELETE FROM Stations;')
cursor.execute('DELETE FROM Ports;')
cursor.execute('DELETE FROM Requests;')
cursor.execute('DELETE FROM Users;')

# Commit changes
conn.commit()

# Generate and insert random data into each table
for _ in range(10):  # Change this to the desired number of entries
    # Generate stationId
    stationId = str(uuid.uuid4())

    # Insert data into Stations table
    coordinates = str([21.231, 83.433])  # Convert list to string
    locationId = str(uuid.uuid4())  # Generate locationId
    cursor.execute('INSERT INTO Stations VALUES (?, ?, ?, ?, ?, ?, ?)', (stationId, locationId, generate_status(), coordinates, generate_address(), 16, ''))

    # Insert data into Users table
    userId = str(uuid.uuid4())
    cursor.execute('INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?, ?)', (userId, generate_name(), generate_email(), generate_string(10), None, None, generate_bool()))

    # Generate and insert two ports for each station
    for i in range(2):
        # Generate portId
        if i == 0:
            portId = generate_port_id(i+1)
        else:
            portId = generate_second_port_id(previous_port_id)

        # Generate emi3Id
        emi3id = generate_emi3id(portId)

        # Insert data into Ports table
        status = generate_status()
        userIdForPort = None if status in ['out_of_order', 'available'] else userId
        cursor.execute('INSERT INTO Ports VALUES (?, ?, ?, ?, ?)', (portId, stationId, userIdForPort, emi3id, status))

        # Add the portId to the station's portIds
        cursor.execute('UPDATE Stations SET portIds = portIds || ? WHERE stationId = ?', (',' + portId, stationId))

        # Save the current portId for generating the next one
        previous_port_id = portId

# Commit changes and close connection
conn.commit()
conn.close()

print("Data inserted successfully.")