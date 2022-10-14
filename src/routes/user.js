import express from 'express'
// import { use } from 'passport'
import User from '../models/User.js'
import Book from '../models/Book.js'
import crypto from 'crypto'
const router = express.Router()

router
  .post('/:userId/add-book', async (req, res, next) => {
    const userId = req.params.userId
    const { 
      title,
      subtitle,
      authors,
      pageCount,
      publishedDate,
      description,
      series,
      categories,
      imageLinks,
      language,
      publisher,
      retail,
      userRating,
      tags
       } = req.body
    // const newBook ={
    //   _id: crypto.randomUUID(),  
    //   title: title,
    //   subtitle: subtitle,
    //   authors: [{authors}],
    //   pageCount: pageCount,
    //   publishedDate: publishedDate,
    //   description: description,
    //   series: series,
    //   categories: categories,
    //   imageLinks: imageLinks,
    //   language: language,
    //   publisher: publisher,
    //   retail: retail,
    //   userRating: userRating,
    //   tags: tags }

      const updateBook = new Book()
      updateBook._id = crypto.randomUUID()
      updateBook.title = title
      updateBook.subtitle = subtitle
      updateBook.authors = [{authors}]
      updateBook.pageCount = pageCount
      updateBook.publishedDate = publishedDate
      updateBook.description = description
      updateBook.series = series
      updateBook.categories = categories
      updateBook.imageLinks = imageLinks
      updateBook.language = language
      updateBook.publisher = publisher
      updateBook.retail = retail
      updateBook.userRating = userRating
      updateBook.tags = tags

      updateBook.save((err, book) => {
        if(err) {
          res.status(400).send(err)
          return next(err)
        } else {
          // User.findByIdAndUpdate(userId)
          //   ({ $push: { books: [newBook._id]}}).exec((err, user) => {
          //     if(err) {
          //       res.status(400).send(err)
          //       return next(err)
          //     } else {
          //       res.status(200).send(user)
          //     }
          //     res.end()
          //   })
          res.status(200).send(book)
          } 
          })
  })
    



export default router