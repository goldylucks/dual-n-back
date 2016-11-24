const _ = require('lodash')
const el = require('./utils').el
const url = 'http://localhost:3000/#/play'

module.exports = {
  tags: ['Play Page'],

  before (client) {
    client
      .url(url)
      .execute('localStorage.clear()')
      .waitForElementVisible('body', 5000)
  },

  'Assert initial UI' (client) {
    assertInitialUi(client)
  },

  'Assert controls disabled on Init' (client) {
    // 5 times just to b sure :)
    _.times(5, () => client.click(el('PlayContainer-guessPosition')))
    _.times(5, () => client.click(el('PlayContainer-guessColor')))
    _.times(5, () => client.keys('cap'))
    assertInitialUi(client) // check that controls didn't do anything. There's probably a better way to test this ...
  },

  after (client) {
    client.execute('localStorage.clear()')
    client.end()
  },
}

function assertInitialUi (client) {
  client.expect.element(el('PlayContainer-start')).to.be.visible
  client.elements('css selector', el('Square'), res => client.expect(res.value.length).to.equal(9))
  client.expect.element(el('PlayContainer-guessPosition')).to.be.present
  client.expect.element(el('PlayContainer-guessColor')).to.be.present
  client.expect.element(el('PlayContainer-guessAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-score')).to.not.be.present
  client.expect.element(el('PlayContainer-pause')).to.not.be.present
  client.expect.element(el('PlayContainer-resume')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-menu')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
}
