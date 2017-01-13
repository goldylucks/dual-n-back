/* eslint no-console: 0 */
global.SHOUT = function SHOUT (...args) {
  console.log('*********************')
  console.log.apply(null, args)
  console.log('*********************')
}

module.exports = {

  logging: true,
  seed: true,
  db: {
    url: process.env.MONGODB_URI,
  },
}
