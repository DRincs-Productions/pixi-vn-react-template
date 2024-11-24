# Pixi’VN template (React + Vite + MUI joy)

![pixi-vn-cover-react](https://github.com/user-attachments/assets/2abc8047-be07-487d-bf9b-de1c1f7c2ca2)

This is a template for creating visual novels in React. It uses the Pixi’VN library and Vite as a build tool.
This Template contains basic functionality inspired by the widespread Visual Noval engine Ren'Py.

## Overview

The first page that appears is the main menu. From there, you can start the game, load a saved game, or go to the settings.

The game page is in `/narration` route. It contains the text box, character avatar, and canvas for the background image. The text box displays the text of the current dialogue. The character avatar displays the character speaking the dialogue. The background image is the background of the scene.
When a choice has to be made, the choices are displayed at the top of the screen.

When you are in the game page, you can access with many features through a list of buttons located at the bottom. In this list you can save the game, load a saved game, skip the dialogue, auto play the dialogue, access to the history modal, and access to the settings modal.

The history modal is a list of all the dialogues and choices that have been displayed.

The settings modal allows you to change the text speed, go to full screen, edit theme colors, and change go to main menu. The settings for the audio have not been added nor the libraries to manage it, but I recommend adding them.

## How to use

Before starting, you need to have Node.js installed on your computer. If you don't have it, you can download it [here](https://nodejs.org/).

### Change the project name

By default, the project is named `my-app` and the title of the game is `My App`. You can search for all occurrences of `my-app` and `My App` in the project and replace them with the name of your game.

### Change the icon

You can change the icon of the game by replacing the images in the `public` folder.

After that, you need to run the following command to change tauri icons.
  
```bash
npm run tauri icon public/pwa-512x512.png
```

### Installation

First, is necessary install the dependencies. To do this, open a terminal in the root folder of the project and run the following command:

```bash
npm install
```

### Start the web application

To start the web application, run the following command:

```bash
npm start
```

This command will start the development server. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

#### Debugging the web application

If you are using Visual Studio Code, you can use the debug configuration provided with the template. To do this, after launching `npm start`, go to the debug section and select the `Launch Chrome` configuration.

### Recommended Visual Studio Code extensions

* [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode): Provides Tauri commands and debugging support.
* [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer): Provides Rust language support.
* [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb): Provides LLDB debugging support.
* [JavaScript and TypeScript Nightly](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next): Provides JavaScript and TypeScript nightlies.
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Integrates ESLint into VS Code.
* [vscode-color-picker](https://marketplace.visualstudio.com/items?itemName=antiantisepticeye.vscode-color-picker): A color picker for Visual Studio Code.
* [Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens): Shows the latest version for each package using code lens.

## Keyboard shortcuts (hotkeys)

* `Space` or `Enter`: Continue the dialogue.
* `Keep Space` or `Keep Enter`: Skip the dialogue.
* `Shift` + `S`: Quick save the game.
* `Shift` + `L`: Quick load the game.
* `Shift` + `H`: Open the history modal.
* `Esc`: Open the settings modal.
* `Shift` + `V`: Hide the UI (Show only the canvas).

## Used libraries

This template uses the following libraries:

Core libraries:

* [Pixi’VN](https://www.npmjs.com/package/@drincs/pixi-vn): A visual novel library.
* [Vite](https://vitejs.dev/): A build tool that aims to provide a faster and leaner development experience for modern web projects.
* [Vite Checker](https://www.npmjs.com/package/vite-plugin-checker): A Vite plugin that checks TypeScript types and ESLint on each build.
* [PWA Vite Plugin](https://vite-pwa-org.netlify.app): A Vite plugin that provides PWA support. This allows the possibility of installing the game as a Progressive Web App.
* [Recoil](https://recoiljs.org/): A state management library for React.
* [React Router](https://reactrouter.com/): A library that provides routing for React applications.
* [Tanstack Query](https://tanstack.com/tanstack-query/): A library that provides a set of tools for getting, caching, and updating game data.
  <img width="44" alt="image" src="https://github.com/user-attachments/assets/bf70dddc-68c0-48f4-9c41-74c22f54e3d1">
  You can use the following button to show Tanstack Query interactions with the game. (the button will be automatically hidden when released)

UI libraries:

* [Mui Joy](https://mui.com/joy-ui/getting-started/): A React UI framework that provides a set of components and styles for building a website.
* [Motion](https://motion.dev/): A simple yet powerful motion library for React.
* [Notistack](https://iamhosseindhv.com/notistack): A library that provides snackbar notifications for React.
* [React Color Palette](https://www.npmjs.com/package/react-color-palette): A library that provides a color picker for React.

Text libraries:

* [i18next](https://www.i18next.com/): A library that gives the possibility to manage multiple translations in the application.
* [Reacr Markdown](https://www.npmjs.com/package/react-markdown): A library that allows you to render markdown in React components.

## Distribution

### Web application

To build the project, run the following command:

```bash
npm run build
```

This command will create a `dist` folder with the files necessary to run the application. You can deploy this folder to a web server.

You can read more about the possibilities of hosting in the [Pixi’VN documentation](https://pixi-vn.web.app/advanced/distribution.html#hosting).

## Prerequisites

### Windows

### MacOS

### Setting Up Linux

https://v1.tauri.app/v1/guides/getting-started/prerequisites/#setting-up-linux

sudo apt update
sudo apt install libwebkit2gtk-4.0-dev

npm run tauri dev

#### WSL2

It's funny googling something and someone talking about me in their question.
I needed to build something in WSL as well so here is how I did it.

1) Ensure you have WSL 2 installed. Use wsl --list -v to check. If you don't, I suggest first setting default wsl version to 2 and then uninstalling the distro and reinstalling it. Backup important files
2) After installing tauri pre-requisitues, follow https://penner.me/getting-tauri-working-in-wsl (installing graphics libraries)

sudo apt install pkg-config \
  libdbus-1-dev \
  libgtk-3-dev \
  libsoup2.4-dev \
  libjavascriptcoregtk-4.0-dev \
  libwebkit2gtk-4.0-dev -y
echo "export DISPLAY=:0" >> ~/.bashrc

restart wsl

You may also need vcxsrv installed as I can see the UI on my PC which has it installed and not my laptop which does not have it installed.

## Cargo update

cd src-tauri/
cargo update
