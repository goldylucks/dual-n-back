import StorageNativeMiddleware from './storage.native'
import testToMiddleware from 'redux-middleware-test-helper'
import { syncBestScore } from '../actions/play'

describe('shared/middlewares/storage.native', () => {
  let cut

  beforeEach('mock cut', () => {
    cut = new StorageNativeMiddleware({
      setItem: spy(),
      mergeItem: spy(),
      getItem: stub(),
    })
  })

  describe('onInitApp', () => {
    afterEach('setup spies', () => {
      cut.AsyncStorage.setItem.reset()
      cut.AsyncStorage.getItem.reset()
    })

    it('should call local storage bestScores with empty object, and not call dispatch', async function () {
      // given
      cut.AsyncStorage.getItem.withArgs('bestScores').returns(undefined)

      // when
      await cut.onInitApp(dispatch)

      // then
      expect(cut.AsyncStorage.setItem).to.have.been.calledWith('bestScores', '{}')
      expect(cut.AsyncStorage.setItem).to.have.been.calledOnce
      expect(dispatch).to.not.have.been.called
    })

    it('should dispatch syncBestScore, and shouldnt call set local storage', async function () {
      // given
      const bestScores = JSON.stringify({ dual1: 40 })
      cut.AsyncStorage.getItem.withArgs('bestScores').returns(bestScores)

      // when
      await cut.onInitApp(dispatch)

      // then
      expect(cut.AsyncStorage.setItem).to.not.have.been.called
      expect(dispatch).to.have.been.calledWith(syncBestScore(JSON.parse(bestScores)))
      expect(dispatch).to.have.been.calledOnce
    })
  })

  describe('onEndGame', () => {
    it('shouldnt call AsyncStorage.setItem', async function () {
      // given
      const playState = {
        mode: 'dual',
        nBack: 2,
        score: 20,
        bestScores: { dual2: 25 },
      }

      // when
      await cut.onEndGame(playState)

      // then
      expect(cut.AsyncStorage.mergeItem).to.not.have.been.called
    })

    // beating an old record
    it('should call AsyncStorage.mergeItem with the new bestScores', async function () {
      // given
      const playState = {
        mode: 'dual',
        nBack: 2,
        score: 50,
        bestScores: { dual2: 25, simple1: 10 },
      }

      // when
      await cut.onEndGame(playState)

      // then
      expect(cut.AsyncStorage.mergeItem).to.have.been.calledWith('bestScores', JSON.stringify({ dual2: 50 }))
    })

    // first time playing a new mode+nBack configuration
    it('should call AsyncStorage.mergeItem with the new bestScores', async function () {
      // given
      const playState = {
        mode: 'simple',
        nBack: 2,
        score: 13,
        bestScores: { dual2: 25, simple1: 10 },
      }

      // when
      await cut.onEndGame(playState)

      // then
      expect(cut.AsyncStorage.mergeItem).to.have.been.calledWith('bestScores', JSON.stringify({ simple2: 13 }))
    })
  })

  testToMiddleware({
    cut: new StorageNativeMiddleware(),
    methods: [
      { methodName: 'onInitApp', actionType: 'init app' },
      { methodName: 'onEndGame', actionType: 'guess colorWrong' },
    ],
  })
})
