import jwt from 'jwt-simple'
import User from '../models/User.js'

const secret = process.env.AUTH_SECRET

const tokenForUser = (user) => {
  return jwt.encode(
    {
      sub: user.id,
      iat: Math.round(Date.now() / 1000),
      exp: Math.round(Date.now() / 1000 * 60 * 60 * 10)
    },
    secret
  )
}

const signin = (req, res, next) => {
  res.send({
    token: tokenForUser(req.user),
    userID: req.user._id
  })
  console.log(`check`)
}

const currentUser = (req, res) => {
  const user = {
    username: req.user.username,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    avatarUrl: req.user.avatarUrl,
    token: tokenForUser(req.user)
  }
  res.send(user)
}

export { signin, currentUser}