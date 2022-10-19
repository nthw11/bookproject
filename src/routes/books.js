import express from 'express'
// import { use } from 'passport'
import User from '../models/User.js'
import Book from '../models/Book.js'
import crypto from 'crypto'
import e from 'express'
const router = express.Router()


// POST add new book by userId
router
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
    
    const bookToAdd = new Book({
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
      }).save((err, book ) =>{
        if(err){
          return next(err)
        } else {
          User.updateOne( 
            {_id: userId},
            { $push: { books: [book._id]}},
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

.put('/:userId/:bookId', async (req, res, next) => {
  const {userId, bookId} = req.params
  const {newUserRating, newCategories, newImageLink, newTags, newNotes} = req.body
  const numNewUserRating = parseInt(newUserRating)
  const bookToUpdate = Book.findById({_id:bookId}, function(err, result){
    if(newUserRating != null){
      console.log(result.userRating)
      result.userRating = newUserRating
    }
    if(newCategories != null){
      console.log(newCategories)
      result.categories.push(newCategories)
      console.log(result.categories)
    }
    if(newImageLink != null){
      result.imageLink = newImageLink
    }
    if(newTags != null){
      result.tags.push(newTags)
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

  .delete('/:userId/:bookId', async (req, res, next) => {
    const {userId, bookId} = req.params
    const user = await User.findById({_id: userId})
      let updatedBooksArr = []
      user.books.map(book => {
        if(book._id != bookId){
          updatedBooksArr.push(book)
        }
        
      })
    user.books = updatedBooksArr
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
  .get('/:userId/books', async (req, res, next) => {
    const userId = req.params.userId
    User.findById(userId)
      .populate('books')
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