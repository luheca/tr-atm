# Casetext Homework Assignment

A demo web app that is a functional ATM machine.

The web app is a React SPA.
This uses a Python backend.
 
## Details
- Developed in React, using Typescript.
- Developed the back-end in Python.
- Incorporated state management in the application.
- Utilized React hooks for managing state and side effects.
- Users are able to check their balance, withdraw funds, and deposit funds after entering their PIN.
- Funds are correctly reflected after a deposit or withdrawal.
- A user's card type is highlighted once they have entered their correct PIN.

## Instructions

### Install, initialize, and Run the Back-end

Create and activate a virtual environment.

`cd tr-atm-backend`

`python3 -m venv ~/tr-atm-venv`

`source ~/tr-atm-venv/bin/activate`

Install required dependencies.

`pip install -r requirements.txt`

Initialize the local file-based database.

`flask --app atm init-db`

Run the back-end server.

`flask --app atm run --debug`

### Install and Run the Front-end

Install required dependencies.

`cd tr-atm-frontend`

`npm install`

Run the front-end.

`npm run dev`

Visit http://localhost:3000/

### Demo Accounts

The following PINs exist in the initial database:
- **1234**: Luis Herrera's Visa
- **2345**: Cuzco Dog's Master Card
- **3456**: Pepper Cat's Pulse


