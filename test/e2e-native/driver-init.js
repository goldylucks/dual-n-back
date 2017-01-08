const wd = require('wd')

const LOCAL_SERVER = {
  host: 'localhost',
  port: 4723,
}

const SAUCE_SERVER = {
  host: 'ondemand.saucelabs.com',
  port: 80,
  username: process.env.SAUCE_USERNAME,
  password: process.env.SAUCE_ACCESS_KEY,
}

// figure out if we want to send to sauce or local server
const SERVER_IN_USE = process.env.SAUCE ? SAUCE_SERVER : LOCAL_SERVER

let driver

function initSession (caps) {
  driver = wd.promiseChainRemote(SERVER_IN_USE)
  return driver.init(caps)
    .setImplicitWaitTimeout(5000)
}

function deleteSession (passed) {
  if (process.env.SAUCE) {
    // for sauce we want to update the test with the status
    return driver
      .sauceJobStatus(passed)
      .quit()
  } else {
    return driver.quit()
  }
}

exports.initSession = initSession
exports.deleteSession = deleteSession
