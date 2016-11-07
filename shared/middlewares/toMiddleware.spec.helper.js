export default ({ methods, cut }) => {
  describe('toMiddleware', () => {
    const middleware = cut.toMiddleware()
    const store = { getState: stub.returns({}) }
    let next
    let action

    beforeEach('setup spies', () => {
      methods.forEach(({ methodName }) => cut[methodName] = spy())
      next = spy()
    })

    it('should call only next(action)', () => {
      // given
      action = { type: '' }

      // when
      middleware(store)(next)(action)

      // then
      expect(next).to.have.been.calledWith(action)
      expect(next).to.have.been.calledOnce
      expect(cut.onInitApp).to.not.have.been.called
      expect(cut.onEndGame).to.not.have.been.called
    })

    methods.forEach(({ methodName, actionType }) => {
      const restOfMethods = methods.filter(m => m.methodName !== methodName)
      it(`should call only next(action), ${methodName}`, () => {
        // given
        action = { type: actionType }

        // when
        middleware(store)(next)(action)

        // then
        expect(next).to.have.been.calledWith(action)
        expect(next).to.have.been.calledOnce
        expect(cut[methodName]).to.have.been.calledOnce
        restOfMethods.forEach(m => {
          expect(cut[m.methodName]).to.not.have.been.called
        })
      })
    })
  })
}
