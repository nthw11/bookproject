import express from 'express'
import passport from 'passport'
import { signin, currentUser } from '../authentication/auth.js'

const router = express.Router()

const requireSignin = passport.authenticate('jwt', {session: false})

const requireAuth = passport.authenticate('jwt', {
  session: false,
  failureRedirect: '/not-authorized'
});

router
.get('/not-authorized', (req, res, next) => {
    console.log(`not authorized`)
    res.status(401).send('Not authorized')
  })

  .post('/', requireSignin, signin )

  .get('/current-user', requireAuth, currentUser)

export default router