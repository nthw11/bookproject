import express from 'express'
// import { use } from 'passport'
import User from '../models/User.js'
const router = express.Router()

router.get('/user', (req, res, next) => {
  let user = new User()
  user.username = "alfie"
  user.firstname = "Alfie"
  user.lastname = "TheDog"
  user.email = "alfie@dog.dog"
  user.phone = "9195616904"
  user.avatarUrl = "https://www.petlandfairfield.com/wp-content/uploads/2022/03/Australian-Terrier.png"
  user.password = "password"
  user.save((err) => {
    if(err) throw err
  })
  res.end()
})



router.get('/')

export default router
