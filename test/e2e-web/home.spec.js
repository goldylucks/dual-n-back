const _ = require('lodash')
const el = require('./utils').el
const url = 'http://localhost:3000/'

module.exports = {
  tags: ['Home Page'],

  before (client) {
    client
      .url(url)
      // set LS with scores to test syncing state from LS
      .execute('localStorage.clear()')
      .waitForElementVisible('body', 5000)
  },

  'Assert redirect home' (client) {
    client.assert.urlContains('/home')
  },

  'Assert defaults modes' (client) {
    client.expect.element(el('HomePage-modePosition')).to.be.visible
    client.expect.element(el('HomePage-modePosition')).to.have.attribute('class').contains('active')
    client.expect.element(el('HomePage-modeAudio')).to.be.visible
    client.expect.element(el('HomePage-modeAudio')).to.not.have.attribute('class').contains('active')
    client.expect.element(el('HomePage-modeColor')).to.be.visible
    client.expect.element(el('HomePage-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert toggling modes on click' (client) {
    client.click(el('HomePage-modePosition'))
    client.expect.element(el('HomePage-modePosition')).to.not.have.attribute('class').contains('active')
    client.click(el('HomePage-modePosition'))
    client.expect.element(el('HomePage-modePosition')).to.have.attribute('class').contains('active')
    client.click(el('HomePage-modeAudio'))
    client.expect.element(el('HomePage-modeAudio')).to.have.attribute('class').contains('active')
    client.click(el('HomePage-modeAudio'))
    client.expect.element(el('HomePage-modeAudio')).to.not.have.attribute('class').contains('active')
    client.click(el('HomePage-modeColor'))
    client.expect.element(el('HomePage-modeColor')).to.not.have.attribute('class').contains('active')
    client.click(el('HomePage-modeColor'))
    client.expect.element(el('HomePage-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert alert when trying to toggle last active mode' (client) {
    client.click(el('HomePage-modePosition'))
    client.click(el('HomePage-modeColor'))
    client.acceptAlert()
    client.expect.element(el('HomePage-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert default nBack' (client) {
    client.expect.element(el('HomePage-nBack')).text.to.equal('2')
  },

  'Assert decrement nBack' (client) {
    client.click(el('HomePage-nBackDecrement'))
    client.expect.element(el('HomePage-nBack')).text.to.equal('1')
    // can't go below 1
    client.click(el('HomePage-nBackDecrement'))
    client.expect.element(el('HomePage-nBack')).text.to.equal('1')
  },

  'Assert increment nBack' (client) {
    client.click(el('HomePage-nBackIncrement'))
    client.click(el('HomePage-nBackIncrement'))
    client.expect.element(el('HomePage-nBack')).text.to.equal('3')
  },

  'Assert default speed' (client) {
    client.expect.element(el('HomePage-speed')).text.to.equal('2000')
  },

  'Assert decrement speed' (client) {
    client.click(el('HomePage-speedDecrement'))
    client.expect.element(el('HomePage-speed')).text.to.equal('1900')
    // can't go below 100
    _.times(21, () => client.click(el('HomePage-speedDecrement')))
    client.expect.element(el('HomePage-speed')).text.to.equal('100')
  },

  'Assert increment speed' (client) {
    client.click(el('HomePage-speedIncrement'))
    client.click(el('HomePage-speedIncrement'))
    client.expect.element(el('HomePage-speed')).text.to.equal('300')
  },

  'Assert bestScore when no previous games' (client) {
    client.expect.element(el('HomePage-bestScore')).text.to.contain('0')
  },

  'Assert routing to auth when user not logged in' (client) {
    client.expect.element(el('HomePage-routeToAuth')).to.be.visible
    client.click(el('HomePage-routeToAuth'))
    client.assert.urlContains('auth')
    client
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  'Assert routing to play screen' (client) {
    client.expect.element(el('HomePage-routeToPlay')).to.be.visible
    client.click(el('HomePage-routeToPlay'))
    client.assert.urlContains('play')
    client
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  'Assert loading game configfrom LS' (client) {
    client
      .execute('localStorage.setItem("gameConfig", JSON.stringify({nBack: 6, speed: 200, modes:{ audio: true, color: true, position: false }}))')
      .execute('store.dispatch({ type: "init app" })')
    client.expect.element(el('HomePage-nBack')).text.to.equal('6')
    client.expect.element(el('HomePage-speed')).text.to.equal('200')
    client.expect.element(el('HomePage-modePosition')).to.not.have.attribute('class').contains('active')
    client.expect.element(el('HomePage-modeAudio')).to.have.attribute('class').contains('active')
    client.expect.element(el('HomePage-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert loading scores from LS' (client) {
    client
      .execute('localStorage.setItem("bestScores", JSON.stringify({audiocolor6: 7}))')
      .execute('store.dispatch({ type: "init app" })')
    client.expect.element(el('HomePage-bestScore')).text.to.contain('7')
    client.click(el('HomePage-nBackIncrement'))
    client.expect.element(el('HomePage-bestScore')).text.to.contain('0')
  },

  'Assert no auth link when user is logged in' (client) {
    client
      .execute('localStorage.setItem("user", JSON.stringify({name: "John Wayne"}))')
      .execute('store.dispatch({ type: "init app" })')
    client.expect.element(el('HomePage-routeToAuth')).to.not.be.present
    client
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  after (client) {
    client.end()
  },
}
