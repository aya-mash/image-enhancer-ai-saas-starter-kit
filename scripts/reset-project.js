#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 Created /${exampleDir}`);
    }

    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      const newDirPath = path.join(exampleDirPath, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ Moved /${dir} to /${exampleDir}/${dir}`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ Deleted /${dir}`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("📁 Created new /app directory");

    // Create index.tsx
    await fs.promises.writeFile(
      path.join(newAppDirPath, "index.tsx"),
      indexContent
    );
    console.log("📄 Created app/index.tsx");

    // Create _layout.tsx
    await fs.promises.writeFile(
      path.join(newAppDirPath, "_layout.tsx"),
      layoutContent
    );
    console.log("📄 Created app/_layout.tsx");

    console.log("\n✅ Project reset complete");
    console.log(
      "You can now remove the `reset-project` script from package.json and safely delete this file."
    );
    console.log("To start the project, run `npm start` or `npx expo start`");
  } catch (error) {
    console.error(`Error resetting project: ${error}`);
  } finally {
    rl.close();
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput);
    } else {
      console.log("Invalid input. Please enter 'y' or 'n'.");
      rl.close();
    }
  }
);
