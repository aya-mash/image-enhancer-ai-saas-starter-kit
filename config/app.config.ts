export const config = {
  appName: "AI Image Enhancer Kit",
  tagline: "Professional AI Photo Enhancement",
  supportEmail: "support@example.com",
  website: "https://example.com",
  
  links: {
    terms: "https://example.com/terms",
    privacy: "https://example.com/privacy",
  },
  
  // Feature Flags
  features: {
    enableGuestAccess: true,
    enableWatermarkPreview: true,
    enablePayPerUnlock: true,
  },

  // Pricing
  payments: {
    currency: "USD",
    priceCents: 299, // $2.99
  },

  // AI Configuration
  ai: {
    model: "gemini-pro", // Vision model
    imageModel: "nano-banana-pro", // Image generation model
  }
};
