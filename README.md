# Firebase API Deployment with Cloud Functions

This repository provides a guide on creating a Firebase API and deploying it to Cloud Functions. Follow the steps below to set up and deploy your Firebase API.

## Prerequisites

Before getting started, ensure you have the following:

- A Firebase project created on the Firebase console (https://console.firebase.google.com)
- Node.js and npm (Node Package Manager) installed on your local machine

## Installation and Setup

1. Clone this repository to your local machine:
   ```
   git clone https://github.com/SapiGo-Team/Sapigo-Firebase-API.git
   ```

2. Navigate to the project directory:
   ```
   cd firebase-api-cloud-functions
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

4. Configure Firebase:
   - Create a new Firebase project or use an existing project on the Firebase console.
   - Generate a new private key for your project by following these steps:
     - Go to your Firebase project settings.
     - Navigate to the "Service Accounts" section.
     - Click on "Generate new private key" to download a JSON file containing your service account credentials.
   - Rename the downloaded JSON file to `serviceAccountKey.json` and place it in the `functions` directory.

5. Configure Cloud Functions:
   - Open the `functions/index.js` file and modify it according to your API requirements.
   - Customize the functions and endpoints to suit your application's needs.

## Deployment

1. Authenticate your Firebase project:
   ```
   firebase login
   ```

2. Initialize Firebase in your project:
   ```
   firebase init
   ```

3. Select "Functions" when prompted and choose your Firebase project.

4. Deploy the Cloud Functions:
   ```
   firebase deploy --only functions
   ```

5. Once the deployment is successful, Firebase will provide you with the API endpoints.

## Testing the API

You can test the API endpoints using tools like cURL or Postman. Make requests to the provided endpoint URLs to interact with your Firebase API.

## SapiGo Firebase API Demo
https://asia-southeast2-capstoneproject-sapigo-388602.cloudfunctions.net/api

POST/login
POST/register
PUT/users:id
DELETE/users:id
GET/users:id
