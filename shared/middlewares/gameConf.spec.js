import testToMiddleware from 'redux-middleware-test-helper'
import GameConfMiddleware from './gameConf'

describe('shared/middlewares/gameConf', () => {
  let cut

  beforeEach('mock cut', () => {
    cut = new GameConfMiddleware()
  })

  describe('validateAtLeastOneModeLeft', () => {
    it('should call alert', () => {
      // given
      const playState = {
        modes: {
          color: false, audio: false, position: true,
        },
      }
      const modesToToggle = 'position'

      // when
      cut.validateAtLeastOneModeLeft(playState, modesToToggle)

      // then
      expect(global.alert).to.have.been.calledOnce
    })

    it('should not call alert', () => {
      // given
      const playState = {
        modes: {
          color: false, audio: true, position: true,
        },
      }
      const modesToToggle = 'position'

      // when
      cut.validateAtLeastOneModeLeft(playState, modesToToggle)

      // then
      expect(global.alert).to.not.have.been.called
    })
  })

  testToMiddleware({
    cut: new GameConfMiddleware({}),
    methods: [
      { methodName: 'validateAtLeastOneModeLeft', actionType: 'toggle modes' },
    ],
  })
})
