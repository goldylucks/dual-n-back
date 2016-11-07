import StorageMiddleware from './storage'

describe('shared/middlewares/storage', () => {
  let cut

  beforeEach('mock cut', () => {
    cut = new StorageMiddleware()
  })

  describe('toMiddleware', () => {
    beforeEach('setup spies', () => {
      cut.onInitApp = spy()
      cut.onEndGame = spy()
    })

    it('should call only next(action)', () => {
      // given
      const store = {}
      const next = spy()
      const action = { type: '' }

      // when
      cut.toMiddleware()(store)(next)(action)

      expect(next).to.have.been.calledWith(action)
      expect(cut.onInitApp).to.not.have.been.called
      expect(cut.onEndGame).to.not.have.been.called
    })

    it('should call only next(action), onInitApp', () => {
      // given
      const store = {}
      const next = spy()
      const action = { type: 'init app' }

      // when
      cut.toMiddleware()(store)(next)(action)

      expect(next).to.have.been.calledWith(action)
      expect(cut.onInitApp).to.have.been.calledOnce
      expect(cut.onEndGame).to.not.have.been.called
    })

    it('should call only next(action), onEndGame', () => {
      // given
      const store = {}
      const next = spy()
      const action = { type: 'guess colorWrong' }

      // when
      cut.toMiddleware()(store)(next)(action)

      expect(next).to.have.been.calledWith(action)
      expect(cut.onEndGame).to.have.been.calledOnce
      expect(cut.onInitApp).to.not.have.been.called
    })

    it('should call only next(action), onEndGame', () => {
      // given
      const store = {}
      const next = spy()
      const action = { type: 'guess positionWrong' }

      // when
      cut.toMiddleware()(store)(next)(action)

      expect(next).to.have.been.calledWith(action)
      expect(cut.onEndGame).to.have.been.calledOnce
      expect(cut.onInitApp).to.not.have.been.called
    })
  })
})
