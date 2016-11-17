const router = require('express').Router()

router.use('/users', require('./users/usersRoutes'))
// router.use('/histories', require('./histories/historiesRoutes'))

module.exports = router
