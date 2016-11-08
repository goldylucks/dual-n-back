// __DEV__ for native
// IS_DEV for web
const isLogging = global.__DEV__

export default logger()

function logger () {
  return isLogging ? devLogger() : prodLogger()
}

function prodLogger () {
  return {
    log: noop,
    info: noop,
    error: noop,
    warn: noop,
  }
}

function devLogger () {
  return console
}

function noop () {}
