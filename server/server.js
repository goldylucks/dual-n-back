const path = require('path')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const express = require('express')
const app = express()

const config = require('./config')
const api = require('./api')

mongoose.connect(config.db.url)

require('./middlewares/appMiddleware')(app)

app.use('/api', api)
app.use('/api', require('./middlewares/404Middleware'))
app.use(require('./middlewares/errorMiddleware'))
app.use('/', express.static(path.join(__dirname, '..', 'client-dist')))

if (!module.parent) {
  app.listen(config.port)
}

console.log('listening on port ' + config.port)
module.exports = app
