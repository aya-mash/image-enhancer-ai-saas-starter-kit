# Image Enhancer AI SaaS Starter Kit

A complete, white-label SaaS starter kit for building AI image enhancement applications with Expo, Firebase, and Google Gemini.

## 📚 Documentation

We have prepared detailed documentation to help you get started, configure, and deploy your app.

**[Open Documentation (HTML)](./docs/index.html)** - Recommended for offline viewing.

Or browse the markdown files directly:

1.  [**Getting Started**](./docs/01-getting-started.md): Installation and environment setup.
2.  [**Firebase Setup**](./docs/02-firebase-setup.md): Creating your project and enabling services.
3.  [**Configuration**](./docs/03-configuration.md): Customizing pricing, AI styles, and payments.
4.  [**Customization**](./docs/04-customization.md): Theming, branding, and adding new features.
5.  [**Deployment**](./docs/05-deployment.md): Building for Stores and deploying to the Web.
6.  [**Troubleshooting**](./docs/06-troubleshooting.md): Common issues and fixes.
7.  [**Architecture**](./docs/07-architecture.md): Understanding the tech stack and data flow.

## Features

- **AI Image Enhancement**: Uses Gemini Image / Nano Banana Pro for enhancement and Gemini Vision for analysis.
- **Monetization Ready**: Integrated Paystack payment flow (easily adaptable to Stripe).
- **Authentication**: Firebase Auth (Email/Password).
- **Cloud Storage**: Firebase Storage for original and processed images.
- **Database**: Firestore for user data and project history.
- **Cross-Platform**: Works on iOS, Android, and Web.
- **Configurable**: Centralized configuration for branding, pricing, and AI prompts.

## Quick Start

1.  **Clone & Install**:
    ```bash
    npm install
    cd functions && npm install && cd ..
    ```

2.  **Configure Environment**:
    *   Copy `.env.example` to `.env` and fill in keys.
    *   Copy `functions/.env.example` to `functions/.env` and fill in keys.

3.  **Run**:
    ```bash
    npx expo start
    ```

See the [Getting Started Guide](./docs/01-getting-started.md) for full details.

## Project Structure

- `app/`: Expo Router screens.
- `components/`: Reusable UI components.
- `config/`: App-wide configuration.
- `docs/`: Detailed documentation.
- `functions/`: Firebase Cloud Functions (backend logic).
- `hooks/`: Custom React hooks.
- `prompt-kit/`: AI prompt definitions.
- `types/`: TypeScript definitions.

## License

MIT
