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

/**
 * Created by ivonet.
 */

'use strict'

const Application = require('spectron').Application
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const path = require('path')
const fs = require('fs')

chai.should()
chai.use(chaiAsPromised)

const timeout = process.env.CI ? 30000 : 10000

describe('Scooch', function () {
  this.timeout(timeout)

  let app

  const removeStoredPreferences = function () {
    const productName = require('../package').productName
    const userDataPath = path.join(process.env.HOME, 'Library', 'Application Support', productName)
    console.log(userDataPath)
    try {
      fs.unlinkSync(path.join(userDataPath, 'activeDemoButtonId.json'))
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
    try {
      fs.unlinkSync(path.join(userDataPath, 'activeSectionButtonId.json'))
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }

  const setupApp = function (app) {
      // app.client.addCommand('dismissAboutPage', function () {
      //   return this.isVisible('.js-nav').then(function (navVisible) {
      //     if (!navVisible) {
      //       return this.click('button[id="get-started"]').pause(500)
      //     }
      //   })
      // })

      // app.client.addCommand('selectSection', function (section) {
      //    return this.click('button[data-section="' + section + '"]').pause(100)
      //         .waitForVisible('#' + section + '-section')
      // })

      // app.client.addCommand('expandDemos', function () {
      //   return this.execute(function () {
      //     for (let demo of document.querySelectorAll('.demo-wrapper')) {
      //       demo.classList.add('is-open')
      //     }
      //   })
      // })

      // app.client.addCommand('collapseDemos', function () {
      //   return this.execute(function () {
      //     for (let demo of document.querySelectorAll('.demo-wrapper')) {
      //       demo.classList.remove('is-open')
      //     }
      //   })
      // })

      // app.client.addCommand('auditSectionAccessibility', function (section) {
      //   const options = {
      //     ignoreRules: ['AX_COLOR_01', 'AX_TITLE_01']
      //   }
      //   return this.selectSection(section)
      //     .expandDemos()
      //     .auditAccessibility(options).then(function (audit) {
      //       if (audit.failed) {
      //         throw Error(section + ' section failed accessibility audit\n' + audit.message)
      //       }
      //     })
      // })

    chaiAsPromised.transferPromiseness = app.transferPromiseness
    return app.client.waitUntilWindowLoaded()
  }

  const startApp = function () {
    app = new Application({
      path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      args: [
        path.join(__dirname, '..')
      ],
      waitTimeout: timeout
    })

    return app.start().then(setupApp)
  }

   // const restartApp = function () {
   //   return app.restart().then(setupApp)
   // }

  before(function () {
    removeStoredPreferences()
    return startApp()
  })

  after(function () {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('opens the windows on the index page', function () {
    return app.client.browserWindow.getTitle().should.eventually.equal('Scooch')
  })

   // it('opens a window displaying the about page', function () {
   //   return app.client.getWindowCount().should.eventually.equal(1)
   //     .browserWindow.isMinimized().should.eventually.be.false
   //     .browserWindow.isDevToolsOpened().should.eventually.be.false
   //     .browserWindow.isVisible().should.eventually.be.true
   //     .browserWindow.isFocused().should.eventually.be.true
   //     .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
   //     .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
   //     .browserWindow.getTitle().should.eventually.equal('Scooch')
   //     .waitForVisible('#about-modal').should.eventually.be.true
   //     .isVisible('.js-nav').should.eventually.be.false
   //     .click('button[id="get-started"]').pause(500)
   //     .isVisible('#about-modal').should.eventually.be.false
   //     .isVisible('.js-nav').should.eventually.be.true
   // })

   // describe('when clicking on a section from the nav bar', function () {
   //   it('it shows the selected section in the main area', function () {
   //     return app.client.dismissAboutPage()
   //       .selectSection('windows')
   //       .isExisting('button.is-selected[data-section="windows"]').should.eventually.be.true
   //       .isVisible('#pdf-section').should.eventually.be.false
   //       .selectSection('pdf')
   //       .isVisible('#windows-section').should.eventually.be.false
   //       .isExisting('button.is-selected[data-section="windows"]').should.eventually.be.false
   //       .isExisting('button.is-selected[data-section="pdf"]').should.eventually.be.true
   //   })
   // })
   //
   // describe('when a demo title is clicked', function () {
   //   it('it expands the demo content', function () {
   //     let onlyFirstVisible = Array(28).fill(false)
   //     onlyFirstVisible[0] = true
   //
   //     return app.client.dismissAboutPage()
   //       .collapseDemos()
   //       .selectSection('windows')
   //       .click('.js-container-target')
   //       .waitForVisible('.demo-box')
   //       .isVisible('.demo-box').should.eventually.deep.equal(onlyFirstVisible)
   //   })
   // })
   //
   // describe('when the app is restarted after use', function () {
   //   it('it launches at last visted section & demo', function () {
   //     let onlyFirstVisible = Array(28).fill(false)
   //     onlyFirstVisible[0] = true
   //
   //     return app.client.waitForVisible('#windows-section')
   //       .then(restartApp)
   //       .then(function () {
   //         return app.client.waitForVisible('#windows-section')
   //           .isVisible('#windows-section').should.eventually.be.true
   //           .isVisible('.demo-box').should.eventually.deep.equal(onlyFirstVisible)
   //       })
   //   })
   // })
   //
   // it('does not contain any accessibility warnings or errors', function () {
   //   return app.client.dismissAboutPage()
   //     .auditSectionAccessibility('windows')
   //     .auditSectionAccessibility('crash-hang')
   //     .auditSectionAccessibility('menus')
   //     .auditSectionAccessibility('shortcuts')
   //     .auditSectionAccessibility('ex-links-file-manager')
   //     .auditSectionAccessibility('dialogs')
   //     .auditSectionAccessibility('tray')
   //     .auditSectionAccessibility('ipc')
   //     .auditSectionAccessibility('app-sys-information')
   //     .auditSectionAccessibility('clipboard')
   //     .auditSectionAccessibility('protocol')
   //     .auditSectionAccessibility('pdf')
   //     .auditSectionAccessibility('desktop-capturer')
   // })
})