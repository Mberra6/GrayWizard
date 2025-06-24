# GrayWizard Project Setup

This README provides instructions on how to set up and run the GrayWizard project on your local machine.

## Prerequisites

Ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- Python (for encryption/decryption scripts)
- MySQL (for the database)

## Setup Instructions

### Setting Up Python Dependencies

1. **Create and activate a virtual environment**:

   Windows:
   ```bash
   python -m venv venv
   venv\Scripts\activate

### macOS/Linux:

1. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate

## Install Python dependencies:

Navigate to the server directory where the requirements.txt file is located and run:
   pip install -r requirements.txt

## Setting Up the Server

1. **Open a terminal and navigate to the server directory:**
   ```bash
   cd server
2. **Install npm packages:**
    ```bash
   npm install
3. **Start the server:**
    ```bash
   npm start

## Setting Up the Client

1. **Open a terminal and navigate to the client directory:**
   ```bash
   cd client
2. **Install npm packages:**
    ```bash
   npm install
3. **Start the client:**
    ```bash
   npm start