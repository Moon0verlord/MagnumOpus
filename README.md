# ⚡️ EV Charging and Management Application ⚡️

## Description
This repository contains the web application built using SvelteKit for Project D. Our application functions as an electric vehicle charging and management hub where users can reserve and request ports to charge their vehicle, which is meant to be used by employees internally working at our client Schuberg Philis.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Features
- Real-time monitoring of EV charging ports
- User-friendly interface for managing charging sessions
- Notifications for updates such as ports being requested.

## Installation
To set up the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Moon0verlord/MagnumOpus
    ```

2. **Navigate to the project directory: (or alternatively open the terminal at this location)**

    ```bash
    cd Svelte/my-app
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

5. **Open your browser and navigate to:**

    ```
    http://localhost:5173
    ```
> [!NOTE]
> If port 5173 is used, SvelteKit will automatically pick another one. If this is the case, make sure you use the correct port instead of the default 5173. You can find this information in the terminal after running the development server.

## Usage
Once the application is running, you can access the following features:

- **Dashboard:** View the status of all charging ports.
- **Port Management:** Reserve or request charging ports at different stations.
- **Pick your Car:** Pick your electric car when first launching the application, so the application is tailored to you.

Navigate through the menu to explore different sections of the application.

## Configuration

Certain features are configured using secret keys, which are not pushed to this GitHub. If you want to still use these features, create a `.env` file in the my-app root directory.
Features that use the .env file are the following:

- **Database Settings:** Configure your database connection settings.
- **Slack Webhook:** Set up notifications to your channel using a slack webhook URL.

The syntax used by the .env file are the following:
```
DATABASE_URL=postgres://user:password@hostname:port/Schuberg
SLACK_WEBHOOK=YOUR_SLACK_WEBHOOK_HERE
```
Remember to change the values to reflect your personal keys.


