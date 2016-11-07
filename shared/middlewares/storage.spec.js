import StorageMiddleware from './storage'
import testToMiddleware from './toMiddleware.spec.helper'
import { syncBestScore } from '../actions/play'

describe('shared/middlewares/storage', () => {
  let cut

  beforeEach('mock cut', () => {
    cut = new StorageMiddleware()
  })

  describe('onInitApp', () => {
    let setItemSpy
    let getItemSpy
    beforeEach('setup spies', () => {
      setItemSpy = spy(localStorage, 'setItem')
      getItemSpy = stub(localStorage, 'getItem')
    })
    afterEach('setup spies', () => {
      localStorage.setItem.reset()
      localStorage.getItem.reset()
      localStorage.setItem.restore()
      localStorage.getItem.restore()
    })

    it('should call local storage bestScore with empty object, and not call dispatch', () => {
      // given
      getItemSpy.withArgs('bestScore').returns(undefined)

      // when
      cut.onInitApp(dispatch)

      // then
      expect(setItemSpy).to.have.been.calledWith('bestScore', '{}')
      expect(setItemSpy).to.have.been.calledOnce
      expect(dispatch).to.not.have.been.called
    })

    it('should dispatch syncBestScore, and shouldnt call set local storage', () => {
      // given
      const bestScore = JSON.stringify({ dual1: 40 })
      getItemSpy.withArgs('bestScore').returns(bestScore)

      // when
      cut.onInitApp(dispatch)

      // then
      expect(setItemSpy).to.not.have.been.called
      expect(dispatch).to.have.been.calledWith(syncBestScore(JSON.parse(bestScore)))
      expect(dispatch).to.have.been.calledOnce
    })
  })

  describe('onEndGame', () => {
    let setItemSpy
    beforeEach('setup spies', () => {
      setItemSpy = spy(localStorage, 'setItem')
    })
    afterEach('setup spies', () => {
      localStorage.setItem.restore()
    })

    it('shouldnt call localStorage.setItem', () => {
      // given
      const playState = {
        mode: 'dual',
        nBack: 2,
        score: 20,
        bestScore: { dual2: 25 },
      }

      // when
      cut.onEndGame(playState)

      // then
      expect(setItemSpy).to.not.have.been.called
    })

    // beating an old record
    it('should call localStorage.setItem with the new bestScore', () => {
      // given
      const playState = {
        mode: 'dual',
        nBack: 2,
        score: 50,
        bestScore: { dual2: 25, simple1: 10 },
      }

      // when
      cut.onEndGame(playState)
      // then
      expect(setItemSpy).to.have.been.calledWith('bestScore', JSON.stringify({ dual2: 50, simple1: 10 }))
    })

    // first time playing a new configuration
    it('should call localStorage.setItem with the new bestScore', () => {
      // given
      const playState = {
        mode: 'simple',
        nBack: 2,
        score: 13,
        bestScore: { dual2: 25, simple1: 10 },
      }

      // when
      cut.onEndGame(playState)
      // then
      expect(setItemSpy).to.have.been.calledWith('bestScore', JSON.stringify({ dual2: 25, simple1: 10, simple2: 13 }))
    })
  })

  testToMiddleware({
    cut: new StorageMiddleware(),
    methods: [
      { methodName: 'onInitApp', actionType: 'init app' },
      { methodName: 'onEndGame', actionType: 'guess colorWrong' },
    ],
  })
})
