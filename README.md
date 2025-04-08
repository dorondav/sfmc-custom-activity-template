# Custom Activity Template for Salesforce Marketing Cloud

This project is a custom activity template designed for Salesforce Marketing Cloud (SFMC) Journey Builder. It allows users to send push notifications with personalized content and advanced configurations.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features

- **Push Notifications**: Send personalized push notifications with dynamic content.
- **Validation**: Validate input fields and ensure data integrity.
- **Customizable UI**: Includes a configuration modal for user input.
- **Integration with SFMC**: Seamless integration with Salesforce Marketing Cloud Journey Builder.
- **Error Logging**: Logs errors and responses for debugging and monitoring.

## Technologies Used

- **Frontend**: Vue 3, Pinia, Vuelidate
- **Backend**: Node.js, Express.js
- **Build Tool**: Vite
- **Logging**: Winston
- **HTTP Requests**: Axios
- **Environment Management**: dotenv

## Project Structure

```plaintext
custom-activity-template/
├── src/
│   ├── components/         # Vue components
│   ├── composables/        # Reusable Vue composables
│   ├── data/               # Static data files
│   ├── stores/             # Pinia state management
│   ├── style.css           # Global styles
│   ├── main.js             # Entry point for the Vue app
│   ├── router.js           # Vue Router configuration
│   ├── App.vue             # Root Vue component
├── routes/                 # Backend API routes
├── lib/                    # Utility libraries (e.g., logger, SFMC integration)
├── .env                    # Environment variables
├── app.js                  # Express server entry point
├── vite.config.mjs         # Vite configuration
├── ecosystem.config.js     # PM2 configuration
├── package.json            # Project dependencies and scripts
└── README.md              # Project documentation
```

## Setup and Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd custom-activity-template
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the required variables. See [Environment Variables](#environment-variables) section.

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

5. **Start the Backend Server**:

   ```bash
   npm run start
   ```

6. **Build for Production** (Optional):
   ```bash
   npm run build
   ```

## Environment Variables

```plaintext
NODE_ENV=development
NODE_VERSION=20.9.0
PORT=8080
VITE_APP_URL=<Frontend URL>
SFMC_TENANT=<SFMC Tenant>
SFMC_CLIENT=<SFMC Client ID>
SFMC_SECRET=<SFMC Client Secret>
SFMC_MID=<SFMC MID>
SFMC_SENT_LOG_DE=<Sent Log Data Extension Key>
SFMC_PUBLISH_LOG_DE=<Publish Log Data Extension Key>
SFMC_ERROR_LOG_DE=<Error Log Data Extension Key>
FREESBE_URL=<Freesbe API URL>
FREESBE_USERNAME=<Freesbe Username>
FREESBE_PASSWORD=<Freesbe Password>
```

## Create and Install Packages:

In Marketing Cloud, go to _Setup | Apps | Installed Packages_:

1. Click New.
2. Give the package a name and description.
3. Click Save.

## API Integration > Server-to-Server

Adding a server-to-server component allows our server to interact with Marketing Cloud i.e. validate a journey activity and upsert records to a data extension.

1. Under Components, click Add Component.
2. Select API Integration.
3. Click Next.
4. Select Server-to-Server.
5. Click Next.
6. Set the properties for the integration, including scopes.
   - Automation > Journeys: _Read_
   - Data > Data Extensions: _Write_
7. Click Save.

> the Save values for `SFMC_SECRET`, `SFMC_CLIENT`, `SFMC_TENANT` values to the env file. this information is key for the app integration with SFMC

## Scripts

- **Development**: `npm run dev` - Starts the Vite development server
- **Build**: `npm run build` - Builds the project for production
- **Preview**: `npm run preview` - Previews the production build
- **Start**: `npm run start` - Starts the backend server
- **Serve**: `npm run serve` - Builds the project and starts both servers

## Usage

1. Open the application in your browser
2. Configure the push notification settings in the provided UI
3. Save the configuration to integrate it with Salesforce Marketing Cloud Journey Builder

## API Endpoints

### `/config.json`

- **Method**: `GET`
- **Description**: Returns the configuration settings for the custom activity

### `/publish`

- **Method**: `POST`
- **Description**: Handles the publish event for the custom activity

### `/execute`

- **Method**: `POST`
- **Description**: Executes the custom activity logic and sends the push notification

### `/validate`

- **Method**: `POST`
- **Description**: Validates the custom activity configuration

### `/check-image-size`

- **Method**: `GET`
- **Description**: Checks if the provided image URL meets size requirements
