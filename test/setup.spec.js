beforeEach('global setup', () => {
  global.dispatch.reset()
  global.setTimeout.reset()
  global.setInterval.reset()
  global.clearInterval.reset()
  global.clearTimeout.reset()
})

afterEach('global teardown', () => {
  global.dispatch.reset()
  global.setTimeout.reset()
  global.setInterval.reset()
  global.clearInterval.reset()
  global.clearTimeout.reset()
})
