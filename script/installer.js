#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')

deleteOutputFolder()
  .then(getInstallerConfig)
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  const rootPath = path.join(__dirname, '..')
  const outPath = path.join(rootPath, 'out')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Scooch-win32-ia32'),
    exe: 'Scooch.exe',
    iconUrl: 'https://raw.githubusercontent.com/IvoNet/scooch-app/master/assets/app-icon/win/app.ico',
    loadingGif: path.join(rootPath, 'assets', 'img', 'loading.gif'),
    noMsi: false,
    outputDirectory: path.join(outPath, 'windows-installer'),
    setupExe: 'ScoochSetup.msi',
    setupIcon: path.join(rootPath, 'assets', 'app-icon', 'win', 'app.ico'),
    skipUpdateIcon: true
  })
}

function deleteOutputFolder () {
  return new Promise((resolve, reject) => {
    rimraf(path.join(__dirname, '..', 'out', 'windows-installer'), (error) => {
      error ? reject(error) : resolve()
    })
  })
}
