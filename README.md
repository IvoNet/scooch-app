# Scooch - Presenting smarter


Is a Powerpoint / KeyNote like slide show app but then in the browser. Everybody has a browser ;-)


## Folder Structure


#### `assets`
This directory contains assets for the app itself: CSS, fonts, images and shared JavaScript libraries or helpers.

#### `app`
This directory contains sub folders for each demo section that requires JavaScript in the main process. This structure is mirrored in the `renderer-process` directory.

The `main.js` file, located in the root, takes each `.js` file in these directories and executes them.

#### `renderer-process`
This directory contains sub folders for each demo section that requires JavaScript in the renderer process. This structure is mirrored in the `main-process` directory.

Each of the HTML page views requires the corresponding renderer-process `.js` files that it needs for its demo.

Each page view reads the content of its relevant main and renderer process files and adds them to the page for the snippets.

#### `sections`
This directory contains sub folders for each demo section. These subfolders contain the HTML files for each of the demo pages. Each of these files is appended to `index.html`, located at the root.

#### `index.html`
This is the main view in the app. It contains the sidebar with navigation and uses [HTML imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/) to append each section HTML page to the `body`.

#### `main.js`
This file contains the lifecycle instructions for the app like how to start and quit, it is the app's main process. It grabs every `.js` file in the `main-process` directory and executes.

The `package.json` sets this file as the `main` file.

#### `package.json`
This file is required when using `npm` and Electron.js. It contains details on the app: the author, dependencies, repository and points to `main.js` as the application's main process file.

#### Docs
The files: `CODE_OF_CONDUCT`, `README`, `docs` and `CONTRIBUTING` files make up the documentation for the project.

#### `test`
This folder contains the tests for the app.

## Building / Releasing / Packaging 

TODO

## Using

TODO


## Libraries

* [Standard](https://www.npmjs.com/package/standard)
* [Snazzy](https://www.npmjs.com/package/snazzy)
* [chai](https://www.npmjs.com/package/chai) / [chai docs](http://chaijs.com) / [chai-as-promised](https://www.npmjs.com/package/chai-as-promised)
* [spectron](https://www.npmjs.com/package/spectron)
* [electron-packager](https://www.npmjs.com/package/electron-packager)
* [wine](https://www.npmjs.com/package/wine-darwin)
* [devtron](https://www.npmjs.com/package/devtron)

# TODO

* Signing of application
