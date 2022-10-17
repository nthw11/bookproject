import express from 'express'
// import { use } from 'passport'
import User from '../models/User.js'
import Book from '../models/Book.js'
import crypto from 'crypto'
const router = express.Router()

router
// POST add new user
  .post('/', async (req, res, next) => {
    const {
      username,
      firstname,
      lastname,
      email,
      phone,
      avatarUrl,
      password
    } = req.body
    const newUser = new User({
      username,
      firstname,
      lastname,
      email,
      phone,
      avatarUrl,
      password
    }).save((err, user) => {
      if(err){
        return next(err)
      } else {
        res.status(200).send(user)
      }
    })
  })


  // PUT Edit user info
  .put('/:userId', async (req, res, next) => {
    const userId = req.params.userId
    const {
      firstname,
      lastname,
      email,
      phone,
      avatarUrl,
      password
    } = req.body
    const update = {
      firstname,
      lastname,
      email,
      phone,
      avatarUrl,
      password
    }
    const updatedUser = await User.findByIdAndUpdate({_id: userId}, update, {new: true}, function (err, response) {
      if(err){
        res.status(400).send(err)
      } else {
        res.status(200).send(response)
      }
    })
  })

// POST add new book by userId
  .post('/:userId/add-book', async (req, res, next) => {
    const userId = req.params.userId
    const { 
      title,
      subtitle,
      authors,
      pageCount,
      publishedDate,
      categories,
      imageLink,
      publisher,
      userRating,
      tags,
      notes
      } = req.body
      const bookToAdd = new Book({})
      bookToAdd.title = title
      bookToAdd.subtitle = subtitle
      bookToAdd.authors = [authors]
      bookToAdd.pageCount = pageCount
      bookToAdd.publishedDate = publishedDate
      bookToAdd.categories = [categories]
      bookToAdd.imageLink = imageLink
      bookToAdd.publisher = publisher
      bookToAdd.userRating = userRating
      bookToAdd.tags = [tags]
      bookToAdd.notes = [notes]
      
      const user = await User.findById(userId)
      user.books.push(bookToAdd)
      user.save((err, user) => {
        if(err) {
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(200).send(user)
          } 
          })
  })
  
  //PUT edit book rating by user id/book id
  .put('/:userId/:bookId', async (req, res, next) => {
    const {userId, bookId} = req.params
    const newRating = req.body.userRating
    
    const userRating = parseInt(newRating)
    const user = await User.findById(userId)  
      user.books.map((book)=> {
        if(book._id == bookId){
          book.userRating = userRating
        }
      })
      user.save((err, user) => {
        if(err) {
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(200).send(user)
          } 
          })
    
    })

  // GET Find user by username, firstname and/or lastname
  .get('/find-user', async (req, res, next) => {
    const {username, firstname, lastname} = req.body
    User.find().where({ username: { $regex: username, $options: "i"}})
      .where({ firstname: { $regex: firstname, $options: "i"}})
      .where({ lastname: { $regex: lastname, $options: "i"}})
      .exec((err, user) => {
        if(err){
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(200).send(user)
        }
      })

  })
    // GET user by userId
    .get('/:userId', async (req, res, next) => {
      const userId = req.params.userId
      User.findById(userId)
      .exec((err, user) => {
        if(err){
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(200).send(user)
        }
      })
    })
    



export default router