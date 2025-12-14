# Deployment Guide

This guide covers how to deploy your application to the web, iOS, and Android.

## 1. Deploying the Backend (Firebase Functions)

Before deploying the app, ensure your backend is live.

1.  Navigate to the functions directory:
    ```bash
    cd functions
    ```
2.  Build the TypeScript code:
    ```bash
    npm run build
    ```
3.  Deploy to Firebase:
    ```bash
    firebase deploy --only functions
    ```

*Verify*: Go to the Firebase Console -> Functions and check that `analyzeAndEnhance` and `verifyAndUnlock` are listed with a green checkmark.

## 2. Deploying to Web

Expo makes web deployment easy.

1.  Install the web dependencies (if not already done):
    ```bash
    npx expo install react-dom react-native-web @expo/metro-runtime
    ```
2.  Build the web bundle:
    ```bash
    npx expo export --platform web
    ```
    This creates a `dist` folder.
3.  Deploy to Firebase Hosting (Recommended):
    *   Initialize Hosting if you haven't: `firebase init hosting`
    *   Set public directory to `dist`.
    *   Configure as a single-page app: **Yes**.
    *   Deploy:
        ```bash
        firebase deploy --only hosting
        ```

## 3. Building for iOS and Android (EAS Build)

We use **EAS (Expo Application Services)** for building native apps.

### Prerequisites

1.  Install EAS CLI:
    ```bash
    npm install -g eas-cli
    ```
2.  Login to Expo:
    ```bash
    eas login
    ```
3.  Configure the project:
    ```bash
    eas build:configure
    ```

### Building for Android (APK/AAB)

1.  **Development Build** (for testing on device):
    ```bash
    eas build --profile development --platform android
    ```
2.  **Production Build** (for Play Store):
    ```bash
    eas build --profile production --platform android
    ```

### Building for iOS (IPA)

*Note: Requires an Apple Developer Account ($99/year).*

1.  **Development Build**:
    ```bash
    eas build --profile development --platform ios
    ```
2.  **Production Build** (for App Store):
    ```bash
    eas build --profile production --platform ios
    ```

## 4. Over-the-Air Updates (EAS Update)

You can push JavaScript updates to your users without a full store review.

1.  Publish an update:
    ```bash
    eas update --branch production --message "Fixing typo"
    ```

---

## Next Steps

*   [Troubleshooting](./06-troubleshooting.md)
