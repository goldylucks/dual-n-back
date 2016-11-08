// [AdGo] 08/11/2016 - using mocha-react-native for now
// in case mocha-react-native will start to make trouble for the web version tests,
// separate native and web to different test commands and use the following for web testing
require('babel-core/register')({
  presets: ['es2015', 'stage-0'],
})
