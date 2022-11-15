import express from 'express'
import passport from 'passport'
import User from '../models/User.js'
import { loginValidation, newUserValidation } from '../util/loginValidation.js'
// import { signin, currentUser } from '../authentication/auth.js'
import { validPassword, genPassword, issueJWT } from '../authentication/authUtilities.js'

const router = express.Router()

const requireSignin = passport.authenticate('jwt', {session: false})

const requireAuth = passport.authenticate('jwt', {
  session: false,
  failureRedirect: '/not-authorized'
});

router
//POST login existing user
.post('/', function(req,res, next){
  const {username, password} = req.body
  console.log(username)
  User.findOne({ username })
  .then((user)=> {
    if(!user){
      res.status(401).send("could not find user")
    }
    const isValid = validPassword(password, user.hash, user.salt)

    if(isValid) {
      const tokenObj = issueJWT(user)
      res.status(200).send(tokenObj)
    } else {
      res.status(401).send('You entered the wrong password')
    }
  })
  .catch((err) => {
    next(err)
  })
})

//POST Add new user
.post('/register', function(req, res, next){
  const {
    username,
    firstname,
    lastname,
    email,
    phone,
    avatarUrl,
    password
  } = req.body

  const saltHash = genPassword(password)

  const salt = saltHash.salt
  const hash = saltHash.hash

  const newUser = new User({
    username,
    firstname,
    lastname,
    email,
    phone,
    avatarUrl,
    hash: hash,
    salt: salt
  })
  newUser.save()
    .then((user) => {

      const jwt = issueJWT(user)

      res.json({success: true, user: user, token: jwt.token, expiresIn: jwt.expires })
    })
    .catch(err => next(err))
})

.get('/not-authorized', (req, res, next) => {
    console.log(`not authorized`)
    res.status(401).send('Not authorized')
  })


// .get('/current-user', requireAuth, currentUser)

export default router