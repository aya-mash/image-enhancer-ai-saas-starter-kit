# Customization Guide

Make the app your own by changing colors, fonts, and assets.

## 1. Theming and Colors

The app uses a centralized theme file at `constants/theme.ts`.

```typescript
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4', // Primary Brand Color
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff', // Primary Brand Color for Dark Mode
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
```

*   **To change the brand color**: Update the `tint` property for both light and dark modes.
*   **To change background colors**: Update `background`.

## 2. Icons and Images

### App Icon

1.  Replace `assets/images/icon.png` (1024x1024px).
2.  Replace `assets/images/adaptive-icon.png` (1024x1024px).
3.  Run `npx expo install expo-image-picker` (if not installed) or just build the app to see changes.

### Splash Screen

1.  Replace `assets/images/splash-icon.png`.
2.  Update background color in `app.json` -> `expo.splash.backgroundColor`.

## 3. Fonts

The app uses the default system font by default. To add custom fonts:

1.  Place font files (`.ttf` or `.otf`) in `assets/fonts/`.
2.  Load them in `app/_layout.tsx` using `useFonts`.

```typescript
import { useFonts } from 'expo-font';

// ... inside RootLayout
const [loaded] = useFonts({
  'MyCustomFont': require('../assets/fonts/MyCustomFont.ttf'),
});
```

3.  Use the font in your styles: `fontFamily: 'MyCustomFont'`.

## 4. Adding New Screens

The app uses **Expo Router** (file-based routing).

*   **New Page**: Create a file in `app/`. E.g., `app/settings.tsx` becomes `/settings`.
*   **New Tab**: Add a file to `app/(tabs)/`.
*   **Dynamic Route**: Use brackets. E.g., `app/project/[id].tsx`.

## 5. Modifying the AI Logic

The AI logic resides in `functions/src/index.ts`.

*   **`describeVision`**: Generates a text description of the uploaded image.
*   **`enhanceImage`**: Sends the description + system prompt + original image to Gemini to generate the new version.

You can tweak the prompts in `functions/src/index.ts` to change how the AI behaves globally, or edit `prompt-kit/prompts.json` for specific styles.

---

## Next Steps

*   [Deployment Guide](./05-deployment.md)
