import StorageMiddleware from './storage'
import testToMiddleware from 'redux-middleware-test-helper'
import { syncBestScore } from '../actions/play'

describe('shared/middlewares/storage', () => {
  let cut

  beforeEach('mock cut', () => {
    cut = new StorageMiddleware()
  })

  describe('syncBestScore', () => {
    it('should call local storage bestScore with empty object, and not call dispatch', () => {
      // given
      localStorage.getItem.withArgs('bestScore').returns(undefined)

      // when
      cut.syncBestScore(dispatch)

      // then
      expect(localStorage.setItem).to.have.been.calledWith('bestScore', '{}')
      expect(localStorage.setItem).to.have.been.calledOnce
      expect(dispatch).to.not.have.been.called
    })

    it('should dispatch syncBestScore, and shouldnt call set local storage', () => {
      // given
      const bestScore = JSON.stringify({ dual1: 40 })
      localStorage.getItem.withArgs('bestScore').returns(bestScore)

      // when
      cut.syncBestScore(dispatch)

      // then
      expect(localStorage.setItem).to.not.have.been.called
      expect(dispatch).to.have.been.calledWith(syncBestScore(JSON.parse(bestScore)))
      expect(dispatch).to.have.been.calledOnce
    })
  })

  describe('onEndGame', () => {
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
      expect(localStorage.setItem).to.not.have.been.called
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
      expect(localStorage.setItem).to.have.been.calledWith('bestScore', JSON.stringify({ dual2: 50, simple1: 10 }))
    })

    // first time playing a new mode+nBack configuration
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
      expect(localStorage.setItem).to.have.been.calledWith('bestScore', JSON.stringify({ dual2: 25, simple1: 10, simple2: 13 }))
    })
  })

  describe('onAuthSuccess', () => {
    it('should set user to localStorage', () => {
      // given
      const user = { test: 'user' }

      // when
      cut.onAuthSuccess(user)

      // then
      expect(localStorage.setItem).to.have.been.calledWith('user', JSON.stringify(user))
    })
  })

  testToMiddleware({
    cut: new StorageMiddleware(),
    methods: [
      { methodName: 'onEndGame', actionType: 'guess colorWrong' },
      { methodName: 'onAuthSuccess', actionType: 'facebook authSuccess' },
    ],
  })
})
