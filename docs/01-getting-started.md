# Getting Started Guide

Welcome to the **Image Enhancer AI SaaS Starter Kit**! This guide will help you set up your development environment and get the application running locally.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **Node.js (LTS)**: Version 18 or higher is required.
    *   [Download Node.js](https://nodejs.org/)
    *   Verify installation: `node -v`
2.  **Git**: For version control.
    *   [Download Git](https://git-scm.com/)
3.  **Expo CLI**: The command-line tool for Expo.
    *   Install globally: `npm install -g expo-cli`
4.  **Firebase CLI**: For deploying backend functions and managing Firebase projects.
    *   Install globally: `npm install -g firebase-tools`
    *   Login: `firebase login`
5.  **Yarn** (Optional but recommended):
    *   Install globally: `npm install -g yarn`

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd image-enhancer-ai-saas-starter-kit
```

### 2. Install App Dependencies

Install the dependencies for the React Native / Expo application.

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

### 3. Install Backend Dependencies

The backend logic lives in the `functions` directory. You must install dependencies there separately.

```bash
cd functions
# Using npm
npm install

# OR using yarn
yarn install

# Return to root
cd ..
```

---

## Environment Setup

This project uses environment variables to manage sensitive keys for Firebase, Google Auth, and Payments.

### 1. App Environment Variables

1.  Locate the `.env.example` file in the root directory.
2.  Copy it to a new file named `.env`.

    ```bash
    cp .env.example .env
    # Windows
    copy .env.example .env
    ```

3.  Open `.env` and fill in the values. You will get these values in the [Firebase Setup Guide](./02-firebase-setup.md).

    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=...
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    ...
    ```

### 2. Functions Environment Variables

1.  Locate the `functions/.env.example` file.
2.  Copy it to a new file named `functions/.env`.

    ```bash
    cd functions
    cp .env.example .env
    # Windows
    copy .env.example .env
    ```

3.  Open `functions/.env` and fill in the values.

    ```env
    GEMINI_API_KEY=...
    PAYMENT_SECRET_KEY=...
    ```

---

## Running the Application

Once you have configured your environment (see [Configuration Guide](./03-configuration.md) and [Firebase Setup](./02-firebase-setup.md)), you can start the app.

### Start the Expo Development Server

```bash
npx expo start
```

This will open a terminal UI with a QR code.

*   **iOS**: Press `i` to open in the iOS Simulator (requires Xcode).
*   **Android**: Press `a` to open in the Android Emulator (requires Android Studio).
*   **Web**: Press `w` to open in the browser.
*   **Physical Device**: Install the "Expo Go" app from the App Store/Play Store and scan the QR code.

### Start the Firebase Functions Emulator (Optional)

If you want to test Cloud Functions locally without deploying:

```bash
cd functions
npm run serve
```

*Note: You will need to update your app to point to the local emulator URL instead of the production URL in `lib/functions-client.ts`.*

---

## Next Steps

*   [Set up Firebase](./02-firebase-setup.md)
*   [Configure the App](./03-configuration.md)
