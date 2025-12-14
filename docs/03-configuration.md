# Configuration Guide

This guide covers how to customize the application's behavior, branding, and pricing.

## 1. App Configuration (`config/app.config.ts`)

The `config/app.config.ts` file is the central place for global settings.

```typescript
export const config = {
  appName: "AI Image Enhancer Kit", // Displayed in headers/titles
  tagline: "Professional AI Photo Enhancement",
  supportEmail: "support@example.com",
  website: "https://example.com",
  
  links: {
    terms: "https://example.com/terms",
    privacy: "https://example.com/privacy",
  },
  
  // Feature Flags
  features: {
    enableGuestAccess: true, // Allow users to try without logging in?
    enableWatermarkPreview: true, // Show watermarked preview before payment?
    enablePayPerUnlock: true, // Enable payment flow?
  },

  // Pricing
  payments: {
    currency: "USD",
    priceCents: 299, // $2.99 per image
  },

  // AI Configuration
  ai: {
    model: "gemini-pro", // Vision model
    imageModel: "nano-banana-pro", // Image generation model
  }
};
```

### Changing Pricing

1.  Update `priceCents` to your desired amount (e.g., `499` for $4.99).
2.  Update `currency` if needed (e.g., `NGN`, `EUR`).
    *   *Note: Ensure your Payment Provider (Paystack/Stripe) supports the currency.*

## 2. AI Prompts (`prompt-kit/prompts.json`)

This file defines the "Styles" available to users. You can add, remove, or edit styles here.

**Structure:**

```json
{
  "id": "unique-id",
  "label": "Display Name",
  "icon": "icon-name", // Ionicons name
  "title": "Full Title",
  "description": "Short description for the UI",
  "systemPrompt": "The instruction sent to the AI..."
}
```

### Adding a New Style

1.  Find an icon name from [Ionicons](https://ionic.io/ionicons).
2.  Add a new object to the array in `prompts.json`.
3.  Write a detailed `systemPrompt`. This is the most important part. Describe the lighting, camera lens, mood, and colors you want the AI to simulate.

## 3. Payment Setup

The app supports **Paystack** out of the box and is structured to support **Stripe** easily.

### Paystack (Default)

1.  Create a [Paystack Account](https://paystack.com/).
2.  Get your **Public Key** and **Secret Key**.
3.  Add Public Key to root `.env`: `EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_...`
4.  Add Secret Key to `functions/.env`: `PAYMENT_SECRET_KEY=sk_...`

### Switching to Stripe

1.  Update `functions/src/payments.ts`:
    *   The code already has a `stripeVerifier`.
    *   You need to install the stripe SDK: `npm install stripe` in `functions/`.
    *   Uncomment the Stripe logic in `getPaymentVerifier`.
2.  Update Frontend:
    *   Replace `PaystackTrigger` component with a Stripe implementation (using `@stripe/stripe-react-native`).

---

## Next Steps

*   [Customization Guide](./04-customization.md)
