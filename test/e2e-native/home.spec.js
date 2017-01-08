'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const wd = require('wd')
const path = require('path')
const driverInit = require('./driver-init')
const initSession = driverInit.initSession
const deleteSession = driverInit.deleteSession

// set up chai and promise
chai.should()
chai.use(chaiAsPromised)
chaiAsPromised.transferPromiseness = wd.transferPromiseness

const app = path.resolve('android/app/build/outputs/apk/app-debug.apk')

describe('Android', function () {
  this.timeout(240 * 1000)
  let passed = false

  let driver
  before(() => {
    driver = initSession({
      platformName: 'Android',
      deviceName: 'Nexus 6',
      platformVersion: '6.0',
      browserName: '',
      app: app,
      appiumVersion: '1.6',
      noReset: true,
      name: 'Basic Android native test',
    })
    return driver
  })
  after(done => {
    deleteSession(passed).nodeify(done)
  })

  describe('find and click', () => {
    it(`should be able to find 'Buttons' and click it`, done => {
      driver
        .elementByAccessibilityId('FOO')
          .click()
        // .elementsByClassName('XCUIElementTypeButton')
        //   .should.eventually.have.length.above(4)
        .then(() => {
          // if anything throws, this will be skipped, so set passed
          passed = true
        })
        .nodeify(done)
    })
  })
})
