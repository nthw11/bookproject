import express from 'express'
import passport from 'passport'
import User from '../models/User.js'
import bodyParser from 'body-parser'
// import jwt from 'jwt-simple'

const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy

const secret = process.env.AUTH_SECRET

const app = express()

const localLogin = new LocalStrategy((username, password, done) => {
  User.findOne({username: username}, function(err, user){
    if(err){
      return done(err)
    }
    if(!user){
      return done(null, false)
    }
  })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
}

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub)
  .then((user) => {
    if(user) { 
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
  .populate({path: 'allBooks'})
  .populate({path: 'currentlyReading'})
  .populate({path: 'upNext'})
  .exec((err, user) => {
    if(err){
      res.status(400).send(err)
      return next(err)
    } else {
      res.status(200).send(user)
    }
  })
})

passport.use(jwtLogin)
passport.use(localLogin)

export default jwtLogin