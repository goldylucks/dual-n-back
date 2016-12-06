import testToMiddleware from 'redux-middleware-test-helper'
import { playInterval, missAMatch, resetBoard, guessCorrect, guessWrong } from '../actions/play'
import PlayMiddleware from './play'

describe('shared/middlewares/play', () => {
  let cut

  beforeEach('mock cut', () => {
    cut = new PlayMiddleware({
      interval: 1,
      resetBoardTimeout: 2,
      isMatch: stub(),
      missedAMatch: stub(),
    })
  })

  describe('onTick', () => {
    beforeEach('setup spies', () => {
      cut.endGame = spy()
    })

    it('should call cut.missedAMatch(history, nBack, modes, guessed), dispatch(missAMatch()), cut.endGame, not call dispatch(playInterval()) and setTimeout', () => {
      // given
      const missed = ['color']
      cut.missedAMatch.returns(missed)
      const history = []
      const speed = 500
      const nBack = 1
      const modes = { color: true, audio: false, position: true }
      const guessed = { color: true, audio: false, position: true }
      const playState = {
        speed,
        history,
        modes,
        nBack,
        guessed,
      }

      // when
      cut.onTick(playState, dispatch)

      // then
      expect(cut.missedAMatch).to.have.been.calledWith(history, nBack, modes, guessed)
      expect(dispatch).to.have.been.calledWith(missAMatch(missed))
      expect(dispatch).to.not.have.been.calledWith(playInterval())
      expect(setTimeout).to.not.have.been.called
    })

    it('should call cut.missedAMatch(history, nBack, history, nBack, modes, guessed), call dispatch(playInterval()) and setTimeout, not call dispatch(missAMatch()), cut.endGame', () => {
      // given
      cut.missedAMatch.returns(false)
      const history = []
      const speed = 500
      const nBack = 1
      const modes = { color: true, audio: false, position: true }
      const guessed = { color: true, audio: false, position: true }
      const playState = {
        speed,
        history,
        modes,
        nBack,
        guessed,
      }

      // when
      cut.onTick(playState, dispatch)

      // then
      expect(cut.missedAMatch).to.have.been.calledWith(history, nBack, modes, guessed)
      expect(dispatch).to.not.have.been.calledWith(missAMatch())
      expect(cut.endGame).to.not.have.been.called
      expect(dispatch).to.have.been.calledWith(playInterval())
      expect(setTimeout).to.have.been.calledOnce
      expect(cut.resetBoardTimeout).to.be.equal(1)
    })
  })

  describe('onResumeGame', () => {
    beforeEach('setup spies', () => {
      cut.onStartGame = spy()
    })
    it('should call store.dispatch(resetBoard()), and cut.onStartGame', () => {
      // given
      const store = { dispatch: spy() }

      // when
      cut.onResumeGame(store)

      // then
      expect(store.dispatch).to.have.been.calledWith(resetBoard())
      expect(cut.onStartGame).to.have.been.calledWith(store)
    })
  })

  describe('onPauseGame', () => {
    beforeEach('setup spies', () => {
      cut.resetTimers = spy()
    })
    it('should call reset timers', () => {
      // when
      cut.onPauseGame()

      // then
      expect(cut.resetTimers).to.have.been.calledOnce
    })
  })

  describe('onGuess', () => {
    it('should call isMatch(history, nBack, guess), store.dispatch(guessCorrect()), should not call store.dispatch(guessWrong)', () => {
      // given
      const guess = 'position'
      const history = [{}]
      const nBack = 2
      const playState = { history, nBack }
      cut.isMatch.returns(true)

      // when
      cut.onGuess(playState, dispatch, guess)

      // then
      expect(cut.isMatch).to.have.been.calledWith(history, nBack, guess)
      expect(dispatch).to.not.have.been.calledWith(guessWrong(guess))
      expect(dispatch).to.have.been.calledWith(guessCorrect(guess))
    })

    it('should call isMatch(history, nBack, guess), store.dispatch(guessPositionCorrect), should not call store.dispatch(guessPositionWrong)', () => {
      // given
      const guess = 'position'
      const history = [{}]
      const nBack = 2
      const playState = { history, nBack }
      cut.isMatch.returns(false)

      // when
      cut.onGuess(playState, dispatch, guess)

      // then
      expect(cut.isMatch).to.have.been.calledWith(history, nBack, guess)
      expect(dispatch).to.have.been.calledWith(guessWrong(guess))
      expect(dispatch).to.not.have.been.calledWith(guessCorrect(guess))
    })
  })

  describe('resetTimers', () => {
    it('should call clearInterval(cut.interval), clearTimeout(cut.timeout)', () => {
      // when
      cut.resetTimers()

      // then
      expect(clearInterval).to.have.been.calledWith(cut.interval)
      expect(clearTimeout).to.have.been.calledWith(cut.resetBoardTimeout)
    })
  })

  testToMiddleware({
    cut: new PlayMiddleware({}),
    methods: [
      { methodName: 'onStartGame', actionType: 'start game' },
      { methodName: 'onPauseGame', actionType: 'pause game' },
      { methodName: 'onResumeGame', actionType: 'resume game' },
      { methodName: 'onGuess', actionType: 'guess' },
    ],
  })
})
