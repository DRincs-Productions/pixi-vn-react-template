# Pixi’VN template (React + Vite + MUI joy)

![pixi-vn-cover](https://github.com/user-attachments/assets/c67ea9f4-c91c-46ea-bfbe-6bc0d18b5de7)

This is a template for creating visual novels in React. It uses the Pixi’VN library and Vite as a build tool.
This Template contains basic functionality inspired by the widespread Visual Noval engine Ren'Py.

## Overview

For testing purposes we will recreate the visual novel [Breakdown](https://joshpowlison.itch.io/breakdown) with Pixi’VN in this guide. Breakdown is a short story that has all the features that a visual novel should have. Josh Powlison, the creator of Breakdown, has given us permission to use his narration for educational purposes❤️.

The first page that appears is the main menu. From there, you can start the game, load a saved game, or go to the settings.

The game page is in `/narration` route. It contains the text box, character avatar, and canvas for the background image. The text box displays the text of the current dialogue. The character avatar displays the character speaking the dialogue. The background image is the background of the scene.
When a choice has to be made, the choices are displayed at the top of the screen.

When you are in the game page, you can access with many features through a list of buttons located at the bottom. In this list you can save the game, load a saved game, skip the dialogue, auto play the dialogue, access to the history modal, and access to the settings modal.

The history modal is a list of all the dialogues and choices that have been displayed.

The settings modal allows you to change the text speed, go to full screen, edit theme colors, and change go to main menu. The settings for the audio have not been added nor the libraries to manage it, but I recommend adding them.

### Keyboard shortcuts (hotkeys)

* `Space` or `Enter`: Continue the dialogue.
* `Keep Space` or `Keep Enter`: Skip the dialogue.
* `Alt` + `S`: Quick save the game.
* `Alt` + `L`: Quick load the game.
* `Alt` + `H`: Open the history modal.
* `Esc`: Open the settings modal.
* `Alt` + `V`: Hide the UI (Show only the canvas).

### Used libraries

This template uses the following libraries:

Core libraries:

* [Pixi’VN](https://www.npmjs.com/package/@drincs/pixi-vn): A visual novel library.
* [Pixi’VN - *ink* Integration](https://www.npmjs.com/package/@drincs/pixi-vn-ink): A library that provides integration with the *ink* language.
* [Vite](https://vitejs.dev/): A build tool that aims to provide a faster and leaner development experience for modern web projects.
* [Vite Checker](https://www.npmjs.com/package/vite-plugin-checker): A Vite plugin that checks TypeScript types and ESLint on each build.
* [PWA Vite Plugin](https://vite-pwa-org.netlify.app): A Vite plugin that provides PWA support. This allows the possibility of installing the game as a Progressive Web App.
* [Zustand](https://zustand-demo.pmnd.rs/): A small, fast, and scalable state management library.
* [React Router](https://reactrouter.com/): A library that provides routing for React applications.
* [Tanstack Query](https://tanstack.com/tanstack-query/): A library that provides a set of tools for getting, caching, and updating game data.
  <img width="44" alt="image" src="https://github.com/user-attachments/assets/bf70dddc-68c0-48f4-9c41-74c22f54e3d1">
  You can use the following button to show Tanstack Query interactions with the game. (the button will be automatically hidden when released)
* [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom designs.
  * [Tailwind CSS Motion](https://rombo.co/tailwind/): A library that provides a set of utilities for creating animations with Tailwind CSS.

UI libraries:

* [Mui Joy](https://mui.com/joy-ui/getting-started/): A React UI framework that provides a set of components and styles for building a website.
* [Motion](https://motion.dev/): A simple yet powerful motion library for React.
* [Notistack](https://iamhosseindhv.com/notistack): A library that provides snackbar notifications for React.
* [React Color Palette](https://www.npmjs.com/package/react-color-palette): A library that provides a color picker for React.

Text libraries:

* [i18next](https://www.i18next.com/): A library that gives the possibility to manage multiple translations in the application.
* [React Markdown](https://www.npmjs.com/package/react-markdown): A library that allows you to render markdown in React components.
  * [React Markdown Typewriter](hhttps://www.npmjs.com/package/react-markdown-typewriter): This library provides a new component, MarkdownTypewriter, that combines the Markdown component of react-markdown with the animation of typewriter. The animation was created entirely with motion.

## How to use

Before starting, you need to have Node.js installed on your computer. If you don't have it, you can download it [here](https://nodejs.org/).

### Recommended Visual Studio Code extensions

* [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode): Provides Tauri commands and debugging support.
* [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer): Provides Rust language support.
* [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb): Provides LLDB debugging support.
* [JavaScript and TypeScript Nightly](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next): Provides JavaScript and TypeScript nightlies.
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Integrates ESLint into VS Code.
* [vscode-color-picker](https://marketplace.visualstudio.com/items?itemName=antiantisepticeye.vscode-color-picker): A color picker for Visual Studio Code.
* [Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens): Shows the latest version for each package using code lens.
* [ink - Pixi'VN](https://marketplace.visualstudio.com/items?itemName=drincs-productions.pixi-vn-ink-vscode): Syntax highlighting for the Ink language.

### Change the icon

You can change the icon of the game by replacing the images in the `public` folder.

After that, you need to run the following command to change tauri icons.
  
```bash
npm run tauri icon public/pwa-512x512.png
```

## *ink* - Custom hashtag scripts

By using the [onInkHashtagScript](https://pixi-vn.web.app/ink/ink-hashtag.html) function, in this template the following features have been added.

**Moving between screens**: This feature allows you to navigate between different screens. The syntax is as follows:

`#` + `navigate` + `[route]`

`route`: The route/path to navigate to. Read more about routes in the [Router documentation](https://pixi-vn.web.app/start/interface-navigate.html).

```ink
#navigate /narration
```

**Rename the character**: This feature allows you to change the name of the character speaking. The syntax is as follows:

`#` + `rename` + `[character id]` + `[new name]`

### *ink* - ink files in the project

The `ink` folder contains the *ink* files that will be used in the game. In this project, all files `.ink`, that are in the `ink` folder, will be included automatically in the project. You can change this behavior by modifying the `src/utils/ink-utility.ts` file.

### *ink* - Writing/testing the narrative with Inky

To write and test the narrative, you can use the **Inky editor**. Inky is a tool for writing interactive fiction using the Ink language. Of course, the special features introduced by pixi-vn will not be ignored by Inky. You can download it [here](https://www.inklestudios.com/ink/).

To use Inky with this template, you can open the `src/main.ink` file in Inky.

```ink
// main.ink
INCLUDE ink/start.ink
INCLUDE ink/second.ink
-> start
```

## Installation

First, is necessary install the dependencies. To do this, open a terminal in the root folder of the project and run the following command:

```bash
npm install
```

## Start the web application

To start the web application, run the following command:

```bash
npm start
```

This command will start the development server. Open [http://localhost:1420](http://localhost:1420) to view it in the browser.

### Debugging the web application

If you are using Visual Studio Code, you can use the debug configuration provided with the template. To do this, after launching `npm start`, go to the debug section and select the `Launch Chrome` configuration.

## Start the Desktop Program (Tauri)

**Prerequisites**: Before starting the Tauri application, you need read the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites) and install [rust](https://v2.tauri.app/start/prerequisites/#rust). Restart your pc.

To start the Tauri application, run the following command:

```bash
npm run tauri dev
```

This command will start the Tauri application. The application will open in a window on your computer.

### Debugging the Desktop Program

If you use Visual Studio Code, you can use the debug configuration that comes with the template. To do this, go to the debug section and select the `Tauri Development Debug` or `Tauri Production Debug` configuration.

Read more about the possibilities of debugging in the [Tauri documentation](https://v2.tauri.app/develop/debug/vscode/).

## Start the Android application (Tauri)

**Prerequisites**: Before starting the Tauri application, you need read the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites) and install [rust](https://v2.tauri.app/start/prerequisites/#rust). And you need to have the [Android SDK installed on your computer](https://v2.tauri.app/start/prerequisites/#android).

To start the Tauri application, run the following command:

```bash
npm run tauri android dev
```

This command will start the Tauri application. The application will open in an emulator or on your Android device.

## Start the iOS application (Tauri)

**Prerequisites**: Before starting the Tauri application, you need read the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites) and install [rust](https://v2.tauri.app/start/prerequisites/#rust). And you need to have the [Xcode installed on your computer](https://v2.tauri.app/start/prerequisites/#ios).

To start the Tauri application, run the following command:

```bash
npm run tauri ios dev
```

## Distribution

### Web application

To build the project, run the following command:

```bash
npm run build
```

This command will create a `dist` folder with the files necessary to run the application. You can deploy this folder to a web server.

You can read more about the possibilities of hosting in the [Pixi’VN documentation](https://pixi-vn.web.app/advanced/distribution.html#hosting).

### Desktop application

You can read more about the possibilities of distribution in the [Pixi’VN documentation](https://pixi-vn.web.app/advanced/distribution-desktop-mobile.html).
