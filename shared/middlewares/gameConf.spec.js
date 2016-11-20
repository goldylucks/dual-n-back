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
        mode: {
          color: false, audio: false, position: true,
        },
      }
      const modeToToggle = 'position'

      // when
      cut.validateAtLeastOneModeLeft(playState, modeToToggle)

      // then
      expect(global.alert).to.have.been.calledOnce
    })

    it('should not call alert', () => {
      // given
      const playState = {
        mode: {
          color: false, audio: true, position: true,
        },
      }
      const modeToToggle = 'position'

      // when
      cut.validateAtLeastOneModeLeft(playState, modeToToggle)

      // then
      expect(global.alert).to.not.have.been.called
    })
  })

  testToMiddleware({
    cut: new GameConfMiddleware({}),
    methods: [
      { methodName: 'validateAtLeastOneModeLeft', actionType: 'toggle mode' },
    ],
  })
})
