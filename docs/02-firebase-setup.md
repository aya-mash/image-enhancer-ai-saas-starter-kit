# Firebase Setup Guide

This project relies on Firebase for Authentication, Database (Firestore), Storage, and Serverless Backend (Cloud Functions). Follow these steps to set up your project.

## 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"**.
3.  Enter a name (e.g., "Image Enhancer AI").
4.  (Optional) Enable Google Analytics.
5.  Click **"Create project"**.

## 2. Enable Services

### Authentication

1.  In the left sidebar, click **Build** -> **Authentication**.
2.  Click **"Get started"**.
3.  Select **"Sign-in method"** tab.
4.  Enable **Email/Password**.
5.  (Optional) Enable **Google**.
    *   You will need to configure OAuth consent screens in Google Cloud Console later for production.

### Cloud Firestore

1.  Click **Build** -> **Firestore Database**.
2.  Click **"Create database"**.
3.  Select a location (e.g., `nam5 (us-central)`).
4.  Start in **Production mode** (we have already set up rules in `firestore.rules`).

### Storage

1.  Click **Build** -> **Storage**.
2.  Click **"Get started"**.
3.  Start in **Production mode** (we have already set up rules in `storage.rules`).
4.  Click **Done**.

### Functions

1.  Click **Build** -> **Functions**.
2.  Click **"Upgrade project"** if prompted. Cloud Functions require the **Blaze (Pay as you go)** plan.
    *   *Note: The free tier is generous, but a credit card is required.*

## 3. Get Configuration Keys

### Web App Config (For Expo)

1.  Click the **Gear icon** (Project Settings) in the sidebar.
2.  Scroll down to **"Your apps"**.
3.  Click the **Web icon** (`</>`).
4.  Register the app (e.g., "Image Enhancer Web").
5.  You will see a `firebaseConfig` object.
6.  Copy these values into your root `.env` file:

    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=apiKey
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=authDomain
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=projectId
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=storageBucket
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=messagingSenderId
    EXPO_PUBLIC_FIREBASE_APP_ID=appId
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=measurementId
    ```

## 4. Initialize Firebase CLI

In your project root terminal:

1.  Login to Firebase:
    ```bash
    firebase login
    ```
2.  Select your project:
    ```bash
    firebase use --add
    # Select the project you just created
    # Alias it as 'default'
    ```

## 5. Deploy Rules and Functions

Now that your project is linked, deploy the security rules and backend functions.

1.  **Deploy Rules**:
    ```bash
    firebase deploy --only firestore:rules,storage
    ```

2.  **Deploy Functions**:
    ```bash
    cd functions
    npm run build
    firebase deploy --only functions
    ```

    *Note: This may take a few minutes. If it fails, check the logs in the Firebase Console.*

## 6. Google Gemini API Key

To use the AI features, you need a Gemini API Key.

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click **"Get API key"**.
3.  Create a key in a new or existing Google Cloud project.
4.  Copy the key to `functions/.env`:
    ```env
    GEMINI_API_KEY=your_key_here
    ```
5.  **Important**: For the deployed functions to see this key, you must either:
    *   Use `dotenv` (which we are using). Ensure `.env` is **NOT** in `.gitignore` for the functions folder if you want to deploy it (Not recommended for security).
    *   **Recommended**: Set secrets in Firebase Functions.
        ```bash
        firebase functions:secrets:set GEMINI_API_KEY
        # Paste your key
        ```
        *Note: You would need to update `functions/src/index.ts` to use `defineSecret` instead of `process.env` if you go this route. For this starter kit, we use `process.env` for simplicity. To deploy env vars safely, consider using `firebase functions:config:set` or including the `.env` file in the deploy (be careful with git).*

    *   **Starter Kit Default**: The starter kit is configured to read from `process.env`. When deploying with `firebase deploy`, the `.env` file in `functions/` is usually ignored by default Firebase behavior unless explicitly included.
    *   **Fix**: To ensure your keys work in production without committing them:
        1.  Open `firebase.json`.
        2.  Ensure `functions.ignore` does NOT include `.env`.
        3.  **OR** (Better): Use Firebase Config.
            ```bash
            firebase functions:config:set app.gemini_key="THE_KEY" app.payment_key="THE_KEY"
            ```
            And update `index.ts` to read `functions.config().app.gemini_key`.

    *   **Simplest for Starter Kit**:
        The `functions/.gitignore` ignores `.env`. However, the Firebase CLI will upload it if it exists locally. Just ensure you have created `functions/.env` locally before running `firebase deploy`.

---

## Next Steps

*   [Configure the App](./03-configuration.md)
