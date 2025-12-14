# Troubleshooting Guide

Common issues and how to resolve them.

## 1. "Firebase: No Firebase App '[DEFAULT]' has been created"

**Cause**: The Firebase configuration is missing or incorrect in `.env`.

**Solution**:
1.  Check your root `.env` file.
2.  Ensure all `EXPO_PUBLIC_FIREBASE_...` variables are set.
3.  Restart the Expo server (`npx expo start -c` to clear cache).

## 2. Functions Error: "INTERNAL" or "UNAUTHENTICATED"

**Cause**: The Cloud Function failed to execute.

**Solution**:
1.  Check the **Firebase Console -> Functions -> Logs**.
2.  **Common Log Errors**:
    *   `Error: Google Generative AI API key not found`: You forgot to set `GEMINI_API_KEY` in `functions/.env` or via `firebase functions:secrets:set`.
    *   `Error: Payment secret key not found`: You forgot `PAYMENT_SECRET_KEY`.
    *   `Quota exceeded`: You ran out of Gemini API quota or Firebase Function invocations.

## 3. "Network Error" or "Connection Refused" on Android Emulator

**Cause**: The Android Emulator cannot access `localhost` directly.

**Solution**:
*   If running functions locally, ensure you are using the correct IP address (usually `10.0.2.2` for Android emulator) or your machine's LAN IP.
*   If using deployed functions, ensure your device has internet access.

## 4. Paystack Payment Fails

**Cause**: Invalid keys or currency mismatch.

**Solution**:
1.  Check that `EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY` matches your Paystack dashboard.
2.  Ensure the currency in `config/app.config.ts` matches your Paystack account currency (e.g., NGN vs USD).
3.  Check if you are in "Test Mode" or "Live Mode".

## 5. Build Fails on EAS

**Cause**: Missing dependencies or configuration errors.

**Solution**:
1.  Read the build logs on the Expo dashboard.
2.  Common issue: `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is missing.
    *   *Fix*: Download these from Firebase Console and place them in the root directory. Update `app.json` to reference them:
        ```json
        "android": {
          "googleServicesFile": "./google-services.json"
        },
        "ios": {
          "googleServicesFile": "./GoogleService-Info.plist"
        }
        ```

## 6. TypeScript Errors

**Cause**: Mismatched types or missing definitions.

**Solution**:
1.  Run `npx tsc --noEmit` to see all errors.
2.  If in `functions/`, run `npm run build` to check backend types.

---

## Need More Help?

*   Check the [Expo Documentation](https://docs.expo.dev/).
*   Check the [Firebase Documentation](https://firebase.google.com/docs).
