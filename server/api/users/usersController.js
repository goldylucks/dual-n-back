const bcrypt = require('bcryptjs')
const CustomError = require('custom-error-generator')
const axios = require('axios')
const config = require('../../config')
const service = require('./usersService')
const Users = require('./usersModel')

module.exports = {
  get: get,
  getOne: getOne,
  login: login,
  fbAuth: fbAuth,
  post: post, // signup
  put: put,
}

function get (req, res, next) {
  Users.find()
    .then(users => res.json(users))
    .catch(next)
}

function getOne (req, res, next) {
  const id = req.params.id
  Users.findById(id)
    .then(user => user ? res.json(user) : res.status(404).send("user doesn't exist"))
    .catch(next)
}

function login (req, res, next) {
  const email = req.body.email
  const password = req.body.password
  Users.findOne({ email }).select('+password')
    .then(user => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new CustomError('custom error', {
          code: 400,
        })('user with that email does not exist or password is incorrect')
      }
      return user
    })
    .then(user => {
      user = user.toObject()
      delete user.password
      user.token = service.signToken(user._id)
      res.json(user)
    })
    .catch(next)
}

function post (req, res, next) {
  const newUser = req.body

  Users.create(newUser)
    .then(user => {
      user = user.toObject()
      delete user.password
      user.token = service.signToken(user._id)
      res.status(201).json(user)
    })
    .catch(err => {
      if (err.errors && err.errors.email && err.errors.email.message) {
        throw new CustomError('custom error', {
          code: 400,
        })('User with that email already exists')
      }
    })
    .catch(next)
}

function put (req, res, next) {
  Users.update({ _id: req.params.id }, { $set: req.body })
    .then(DBres => res.json(DBres))
    .catch(next)
}

function fbAuth (req, res, next) {
  let userId
  const body = req.query
  const email = body.email
  const fbClientAccessToken = body.accessToken
  const update = {
    name: body.name,
    fbUserId: body.userID,
    email: email,
    fbPictureUrl: body.picture && body.picture.split('"url":"')[1].split('"')[0],
  }
  // Find or create user
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }
  Users.findOneAndUpdate({ email: email }, update, options)
  .then(user => {
    user = user.toObject()
    delete user.password
    user.token = service.signToken(user._id)
    res.status(201).json(user)
    userId = user._id
  })
  .catch(next)
  // client get the user object response
  // exchange client token for long term server token behind the scenes
  // and save it on user collection
  .then(() => {
    return axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${config.fbId}&client_secret=${config.fbSecret}&grant_type=fb_exchange_token&fb_exchange_token=${fbClientAccessToken}`)
  })
  .then(fbRes => {
    const fbServerAccessToken = fbRes.data.split('=')[1]
    Users.findOneAndUpdate({ _id: userId }, { $set: { fbAccessToken: fbServerAccessToken } })
  })
  .catch(next)
}
