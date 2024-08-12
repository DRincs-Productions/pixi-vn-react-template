# Pixi’VN template (React + Vite + MUI joy)

This is a template for creating visual novels in React. It uses the Pixi’VN library and Vite as a build tool.
This Template contains basic functionality inspired by the widespread Visual Noval engine Ren'Py.

## Overview

The first page that appears is the main menu. From there, you can start the game, load a saved game, or go to the settings.

The game page is in `/game` route. It contains the text box, character avatar, and canvas for the background image. The text box displays the text of the current dialogue. The character avatar displays the character speaking the dialogue. The background image is the background of the scene.
When a choice has to be made, the choices are displayed at the top of the screen.

When you are in the game page, you can access with many features through a list of buttons located at the bottom. In this list you can save the game, load a saved game, skip the dialogue, auto play the dialogue, access to the history modal, and access to the settings modal.

The history modal is a list of all the dialogues and choices that have been displayed.

The settings modal allows you to change the text speed, go to full screen, edit theme colors, and change go to main menu. The settings for the audio have not been added nor the libraries to manage it, but I recommend adding them.

## How to use

Before starting, you need to have Node.js installed on your computer. If you don't have it, you can download it [here](https://nodejs.org/).

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

#### Debugging

If you use Visual Studio Code, you can use the debug configuration that comes with the template. To do this, go to the debug section and select the `Launch Chrome` configuration.

## Keyboard shortcuts (hotkeys)

* `Space` or `Enter`: Continue the dialogue.
* `Keep Space` or `Keep Enter`: Skip the dialogue.
* `Shift` + `S`: Quick save the game.
* `Shift` + `L`: Quick load the game.
* `Shift` + `H`: Open the history modal.
* `Esc`: Open the settings modal.
* `Shift` + `V`: Hide the Interface (Show only the canvas).

## Used libraries

This template uses the following libraries:

Core libraries:

* [Pixi’VN](https://www.npmjs.com/package/@drincs/pixi-vn): A visual novel library for PixiJS.
* [Vite](https://vitejs.dev/): A build tool that aims to provide a faster and leaner development experience for modern web projects.
* [Vite Checker](https://www.npmjs.com/package/vite-plugin-checker): A Vite plugin that checks TypeScript types and ESLint on each build.
* [PWA Vite Plugin](https://vite-pwa-org.netlify.app): A Vite plugin that provides PWA support. This allows the possibility of installing the game as a Progressive Web App.
* [Recoil](https://recoiljs.org/): A state management library for React.
* [React Router](https://reactrouter.com/): A library that provides routing for React applications.

UI libraries:

* [Mui Joy](https://mui.com/joy-ui/getting-started/): A React UI framework that provides a set of components and styles for building a website.
* [Framer Motion](https://www.framer.com/motion/): A simple yet powerful motion library for React.
* [Notistack](https://iamhosseindhv.com/notistack): A library that provides snackbar notifications for React.

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
