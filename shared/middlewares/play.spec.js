import testToMiddleware from 'redux-middleware-test-helper'
import { playInterval, missAMatch, resetBoard, guessColorCorrect, guessColorWrong, guessPositionCorrect, guessPositionWrong } from '../actions/play'
import PlayMiddleware from './play'

describe('shared/middlewares/play', () => {
  let cut

  beforeEach('mock cut', () => {
    cut = new PlayMiddleware({
      interval: 1,
      resetBoardTimeout: 2,
      isColorMatch: stub(),
      isPositionMatch: stub(),
      missedAMatch: stub(),
    })
  })

  describe('onTick', () => {
    beforeEach('setup spies', () => {
      cut.endGame = spy()
    })

    it('should call cut.missedAMatch(history, nBack, positionGuessed, colorGuessed), dispatch(missAMatch()), cut.endGame, not call dispatch(playInterval()) and setTimeout', () => {
      // given
      cut.missedAMatch.returns(true)
      const history = []
      const speed = 500
      const nBack = 1
      const mode = { color: true, audio: false, position: false }
      const positionGuessed = true
      const colorGuessed = true
      const playState = {
        speed,
        history,
        mode,
        nBack,
        positionGuessed,
        colorGuessed,
      }

      // when
      cut.onTick(playState, dispatch)

      // then
      expect(cut.missedAMatch).to.have.been.calledWith(history, nBack, mode, positionGuessed, colorGuessed)
      expect(dispatch).to.have.been.calledWith(missAMatch())
      expect(cut.endGame).to.have.been.calledOnce
      expect(dispatch).to.not.have.been.calledWith(playInterval())
      expect(setTimeout).to.not.have.been.called
    })

    it('should call cut.missedAMatch(history, nBack, positionGuessed, colorGuessed), call dispatch(playInterval()) and setTimeout, not call dispatch(missAMatch()), cut.endGame', () => {
      // given
      cut.missedAMatch.returns(false)
      const history = []
      const speed = 500
      const nBack = 1
      const mode = { color: true, audio: false, position: false }
      const positionGuessed = true
      const colorGuessed = true
      const playState = {
        speed,
        history,
        mode,
        nBack,
        positionGuessed,
        colorGuessed,
      }

      // when
      cut.onTick(playState, dispatch)

      // then
      expect(cut.missedAMatch).to.have.been.calledWith(history, nBack, mode, positionGuessed, colorGuessed)
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

  describe('onGuessPosition', () => {
    it('should call isPositionMatch(history, nBack), store.dispatch(guessPositionCorrect), should not call store.dispatch(guessPositionWrong)', () => {
      // given
      const history = [{}]
      const nBack = 2
      const playState = { history, nBack }
      cut.isPositionMatch.returns(true)

      // when
      cut.onGuessPosition(playState, dispatch)

      // then
      expect(cut.isPositionMatch).to.have.been.calledWith(history, nBack)
      expect(dispatch).to.not.have.been.calledWith(guessPositionWrong())
      expect(dispatch).to.have.been.calledWith(guessPositionCorrect())
    })

    it('should call isPositionMatch(history, nBack), store.dispatch(guessPositionCorrect), should not call store.dispatch(guessPositionWrong)', () => {
      // given
      const history = [{}]
      const nBack = 2
      const playState = { history, nBack }
      cut.isPositionMatch.returns(false)

      // when
      cut.onGuessPosition(playState, dispatch)

      // then
      expect(cut.isPositionMatch).to.have.been.calledWith(history, nBack)
      expect(dispatch).to.have.been.calledWith(guessPositionWrong())
      expect(dispatch).to.not.have.been.calledWith(guessPositionCorrect())
    })
  })

  describe('onGuessColor', () => {
    it('should call isColorMatch(history, nBack), store.dispatch(guessColorCorrect), should not call store.dispatch(guessColorWrong)', () => {
      // given
      const history = [{}]
      const nBack = 2
      const playState = { history, nBack }
      cut.isColorMatch.returns(true)

      // when
      cut.onGuessColor(playState, dispatch)

      // then
      expect(cut.isColorMatch).to.have.been.calledWith(history, nBack)
      expect(dispatch).to.not.have.been.calledWith(guessColorWrong())
      expect(dispatch).to.have.been.calledWith(guessColorCorrect())
    })

    it('should call isColorMatch(history, nBack), store.dispatch(guessColorCorrect), should not call store.dispatch(guessColorWrong)', () => {
      // given
      const history = [{}]
      const nBack = 2
      const playState = { history, nBack }
      cut.isColorMatch.returns(false)

      // when
      cut.onGuessColor(playState, dispatch)

      // then
      expect(cut.isColorMatch).to.have.been.calledWith(history, nBack)
      expect(dispatch).to.have.been.calledWith(guessColorWrong())
      expect(dispatch).to.not.have.been.calledWith(guessColorCorrect())
    })
  })

  describe('endGame', () => {
    beforeEach('setup spies', () => {
      cut.resetTimers = spy()
    })
    it('should call reset timers', () => {
      // when
      cut.endGame()

      // then
      expect(cut.resetTimers).to.have.been.calledOnce
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
      { methodName: 'onGuessColor', actionType: 'guess color' },
      { methodName: 'onGuessPosition', actionType: 'guess position' },
    ],
  })
})
