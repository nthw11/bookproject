import express from 'express'
// import { use } from 'passport'
import User from '../models/User.js'
import Book from '../models/Book.js'
import crypto from 'crypto'
import e from 'express'
const router = express.Router()
import { verifyToken } from '../authentication/verifyToken.js'

// POST add new book by userId
router
.post('/:userId/add-book', verifyToken, async (req, res, next) => {
  const userId = req.params.userId
  const { 
    title,
    subtitle,
    authors,
    pageCount,
    publishedDate,
    categories,
    description,
    imageLink,
    publisher,
    userRating,
    tags,
    notes
    } = req.body
    
    const bookToAdd = new Book({
        title,
        subtitle,
        authors,
        pageCount,
        publishedDate,
        categories,
        description,
        imageLink,
        publisher,
        userRating,
        tags,
        notes
      }).save((err, book ) =>{
        if(err){
          return next(err)
        } else {
          User.updateOne( 
            {_id: userId},
            { $push: { allBooks: [book._id]}},
            function(err, user){
              if(err) {
                res.status(400).send(err)
              } else {
                res.status(200).send(user)
              } 
            })
          }
        })
      })

//PUT edit book rating by user id/book id

.put('/:userId/:bookId', verifyToken, async (req, res, next) => {
  const {userId, bookId} = req.params
  const {newUserRating, newImageLink, newTags, newNotes} = req.body
  const numNewUserRating = parseInt(newUserRating)
  const bookToUpdate = Book.findById({_id:bookId}, function(err, result){
    if(newCurrentlyReading != null){
      result.currentlyReading = newCurrentlyReading
    }
    if(newUserRating != null){
      result.userRating = newUserRating
    }
    // if(newFinishedReading != null){
    //   console.log(newFinishedReading)
    //   result.finishedReading.push(newFinishedReading)
    //   console.log(result.finishedReading)
    // }
    if(newImageLink != null){
      result.imageLink = newImageLink
    }
    if(newTags != null){
      result.tags = newTags
    }
    if(newNotes != null){
      result.notes.push(newNotes)
    }    
    result.save((err, book) => {
      if(err){
        return next(err)
      } else {
        res.status(200)
        .send(book)
      }
    })
  })
  })

  .delete('/:userId/:bookId', verifyToken, async (req, res, next) => {
    const {userId, bookId} = req.params
    const user = await User.findById({_id: userId})
      let updatedBooksArr = []
      user.allBooks.map(book => {
        if(book._id != bookId){
          updatedBooksArr.push(book)
        }
        
      })
    user.allBooks = updatedBooksArr
    await user.save()
    Book.findByIdAndDelete(bookId).exec((err) => {
      if(err){
        res.status(400).send(err)
        return next(err)
      } else {
        res.send('book has been successfully deleted').status(204).end()
      }
    })
  })

  //GET all books by userId
  .get('/:userId/books', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    User.findById(userId)
      .populate('bookshelves')
      .exec((err, user) => {
        if(err) {
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(200).send(user)
        }
      })
  })

export default router