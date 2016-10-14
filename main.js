/*
 * Copyright 2016 Ivo Woltring <WebMaster@ivonet.nl>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const glob = require('glob')
const path = require('path')
const {app, BrowserWindow, protocol} = require('electron')

if (process.mas) {
   app.setName('Scooch')
}

const debug = /--debug/.test(process.argv[2])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function initScoochApp() {
   let shouldQuit = makeSingleInstance()
   if (shouldQuit) {
      return app.quit()
   }

   loadApp()

   let windowOptions = {
      width: 1080,
      minWidth: 800,
      height: 950,
      minHeight: 600,
      title: app.getName()
   }

   // Create the browser window.
   mainWindow = new BrowserWindow(windowOptions)
   mainWindow.loadURL(`file://${__dirname}/index.html`)

   if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
   }

   // Emitted when the window is closed.
   mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
   })

   protocol.registerFileProtocol('resource', (request, callback) => {
      var url = request.url.substr(11);
      var path2 = path.join(__dirname, url)
      console.log(path2)
      callback({path: path2});
   });
   protocol.registerFileProtocol('template', (request, callback) => {
      const model = require(`${__dirname}/renderer-process/model.js`)
      const arr = request.url.substr(11).split('/');
      const template = arr[0]
      const res = arr[1]
      const templates = model.templates()
      let pad = "";
      templates.forEach((element, index, array) => {
         if (element.title === template) {
            pad = path.join(path.dirname(element.file), res)
         }
      })
      callback({path: pad});
   });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initScoochApp)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
   // On OS X it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   if (process.platform !== 'darwin') {
      app.quit()
   }
})

app.on('activate', function () {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (mainWindow === null) {
      initScoochApp()
   }
})

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
   if (process.mas) {
      return false
   }
   return app.makeSingleInstance(() => {
      if (mainWindow) {
         if (mainWindow.isMinimized()) {
            mainWindow.restore()
         }
         mainWindow.focus()
      }
   })
}

function loadApp() {
   let files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
   files.forEach((file) => {
      console.log('Loading:', file)
      require(file)
   })
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
