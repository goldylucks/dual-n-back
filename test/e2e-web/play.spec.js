const _ = require('lodash')
const el = require('../utils').el
const url = require('../utils').BASE_URL + '/play'

module.exports = {
  tags: ['Play Page'],

  before (client) {
    client
      .url(url)
      .execute('localStorage.clear()')
      .waitForElementVisible('body', 5000)
  },

  'initial UI' (client) {
    assertInitialUi(client)
  },

  'controls disabled on Init' (client) {
    // 5 times just to b sure :)
    _.times(5, () => client.click(el('PlayContainer-guessPosition')))
    _.times(5, () => client.click(el('PlayContainer-guessColor')))
    _.times(5, () => client.keys('cap'))
    assertInitialUi(client) // check that controls didn't do anything. There's probably a better way to test this ...
  },

  'game 1 - color' (client) {
    const modes = { audio: false, position: false, color: true }
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 1, speed: 500, modes: { audio: false, position: false, color: true } } })')
      .click(el('PlayContainer-start'))
    assertActiveUi(client, { modes })
    client.pause(10000, () => {
      assertGameOver(client, { modes })
    })
  },

  'game 2 - audio' (client) {
    const modes = { audio: true, position: false, color: false }
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 1, speed: 500, modes: { audio: true, position: false, color: false } } })')
      .click(el('PlayContainer-retry'))
    assertActiveUi(client, { modes })
    client.pause(10000, () => {
      assertGameOver(client, { modes })
    })
  },

  'game 3 - position' (client) {
    const modes = { audio: false, position: true, color: false }
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 1, speed: 500, modes: { audio: false, position: true, color: false } } })')
      .click(el('PlayContainer-retry'))
    assertActiveUi(client, { modes })
    client.pause(10000, () => {
      assertGameOver(client, { modes })
    })
  },

  // 'pause button' (client) {
  //   client.click(el('PlayContainer-pause'))
  //   client.expect.element(el('PlayContainer-pause')).to.not.be.present
  //   client.expect.element(el('PlayContainer-resume')).to.be.present
  //   client.expect.element(el('PlayContainer-score')).to.be.present
  //   client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  //   client.expect.element(el('PlayContainer-menu')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  // },

  // 'controls disabled on pause' (client) {
  //   client.click(el('PlayContainer-guessPosition'))
  //   client.click(el('PlayContainer-guessColor'))
  //   client.keys('cap')
  //   client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  // },

  // 'resume button' (client) {
  //   client.click(el('PlayContainer-resume'))
  //   client.expect.element(el('PlayContainer-score')).to.be.present
  //   client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  //   client.expect.element(el('PlayContainer-menu')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  // },

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
  client.expect.element(el('PlayContainer-retry')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
}

function assertActiveUi (client, { modes }) {
  client.expect.element(el('PlayContainer-start')).to.not.be.present
  client.expect.element(el('PlayContainer-score')).to.be.present
  client.expect.element(el('PlayContainer-pause')).to.be.present
  client.expect.element(el('PlayContainer-resume')).to.not.be.present
  client.expect.element(el('PlayContainer-menu')).to.not.be.present
  client.expect.element(el('PlayContainer-retry')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  _.forOwn(modes, (isActive, mode) => {
    isActive && client.expect.element(el(`PlayContainer-guess${_.capitalize(mode)}`)).to.be.present
    !isActive && client.expect.element(el(`PlayContainer-guess${_.capitalize(mode)}`)).to.not.be.present
  })
  if (modes.position) {
    client.elements('css selector', el('Square'), res => client.expect(res.value.length).to.equal(9))
  }
}

// TODO - pass nBack turn and last turn
function assertGameOver (client, { score, bestScore, modes } = {}) {
  client.expect.element(el('PlayContainer-start')).to.not.be.present
  client.expect.element(el('PlayContainer-guessPosition')).to.not.be.present
  client.expect.element(el('PlayContainer-guessColor')).to.not.be.present
  client.expect.element(el('PlayContainer-guessAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-score')).to.not.be.present
  client.expect.element(el('PlayContainer-pause')).to.not.be.present
  client.expect.element(el('PlayContainer-resume')).to.not.be.present
  client.expect.element(el('PlayContainer-menu')).to.be.present
  client.expect.element(el('PlayContainer-retry')).to.be.present
  client.expect.element(el('PlayContainer-gameOverHeader')).to.be.present
  client.expect.element(el('PlayContainer-gameOverNBack')).to.be.present
  client.expect.element(el('PlayContainer-gameOverScore')).to.be.present
  modes.audio && client.expect.element(el('PlayContainer-gameOverAudio')).to.be.present
  !modes.audio && client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present

  if (score) {
    client.expect.element(el('PlayContainer-gameOverScore')).text.to.contain(`${score}/`)
  }
  if (bestScore) {
    client.expect.element(el('PlayContainer-gameOverScore')).text.to.contain(`${bestScore}/`)
  }
}
