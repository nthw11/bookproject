import express from 'express'
import User from '../models/User.js'
import Club from '../models/Club.js'
import Book from '../models/Book.js'
import passport from 'passport'

import { verifyToken, tokenUser } from '../authentication/verifyToken.js'

const requireAuth = passport.authenticate('jwt', {session: false})

const router = express.Router()

router


  // PUT Edit user info
  .put('/:userId', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const {
      firstname,
      lastname,
      email,
      phone,
    } = req.body

    const updatedUser = User.findById({_id: userId}, function (err, response) {
      if(err){
        res.status(400).send(err)
      } else {
        if(firstname != ''){
          response.firstname = firstname
        }
        if(lastname != ''){
          response.lastname = lastname
        }
        if(phone != ''){
          response.phone = phone
        }
        if(email != ''){
          response.email = email
        }
        response.save((err, user) =>{
          if(err) {
            return next(err)
          } else {
            res.status(200).send(user)
            
          }
        })
      }
    })
  })

  // PUT Edit user book info
  .put('/:userId/book-update', verifyToken, (req, res, next) => {
    const userId = req.params.userId
    const {
      newCurrentlyReading,
      newFinishedReading,
      newUpNext,
      newBookshelf,
      outOfFinishedReading,
      moveFromUpNext
    } = req.body
    User.findById({_id: userId}, function (err, result) {
      if(newCurrentlyReading != null){
        const newArray = []
        result.currentlyReading = newCurrentlyReading
        result.upNext.filter(book => {
          if(book != newCurrentlyReading){
            newArray.push(book)
          }
        })
        result.upNext = newArray
      } 
      if (moveFromUpNext == 'next') {
        if(result.upNext.length != 0 ){
          console.log(result.upNext)
          result.currentlyReading = result.upNext.pop()
        } else {
          console.log('null')
          result.currentlyReading = null;
          console.log(result.currentlyReading)
        }
      }
      if(newFinishedReading != null){
        Book.findByIdAndUpdate(newFinishedReading, {$push: {tags: "Read"}}, function(err, res){
          if(err){
            console.log(err)
          } else {
            console.log('user.js 79')
            res.save();
          }
        } )
      }
      if(newUpNext != null){
        const newArray = []
        newArray.push(newUpNext)
        result.upNext.filter(upNextBook => {
          if(upNextBook != newUpNext){
            newArray.push(upNextBook)
          }
        })
        // result.upNext.push(newUpNext)
        result.upNext = newArray
      }
      if(newBookshelf != null){
        const newArray = []
        const newShelf = {shelfName: newBookshelf, shelfContents: []}
        newArray.push(newBookshelf)
        result.bookshelves.filter(shelf => {
          if(shelf.shelfName != newBookshelf){
            newArray.push(newShelf)
          }
        })
        // result.upNext.push(newUpNext)
        result.bookshelves = newArray
      }
      if(outOfFinishedReading != null){
        // result.allBooks.push(outOfFinishedReading)
        // result.finishedReading.pull(outOfFinishedReading)
        Book.findByIdAndUpdate(outOfFinishedReading, {$pull: {tags: "Read"}}, function(err, res){
          if(err){
            console.log(err)
          } else {
            console.log('user.js 113')
          }
        } )
      }
      result.save((err, user) => {
        if(err)  {
          return next(err)
        } else {
          // console.log(`updated`)
          res.status(200)
          .send(user)
        }
      })
    })
  })

  // PUT add or update books to bookshelves
  .put('/:userId/:bookshelfId/bookshelf-update', verifyToken, (req, res, next) => {
    const {userId, bookshelfId} = req.params
    const { bookId } = req.body

    //==============
    User.findById({_id: userId}, function (err, result) {
      const bookshelf = result.bookshelves.filter(shelf => {
        if(shelf._id == bookshelfId){
          return shelf
        }
      })
      const updatedShelf = []
      if(!bookshelf.includes(bookId)){
        bookshelf.push(bookId)
      } else {
        bookshelf.shelfContents.filter(book => {
          if(book._id != bookId){
            updatedShelf.push(book)
          }
        })
      }
      result.save((err, user) => {
        if(err)  {
          return next(err)
        } else {
          res.status(200)
          .send(user)
        }
      })
    })
  })


  // })

  // GET Find user by username, firstname and/or lastname
  .get('/find-user', verifyToken, async (req, res, next) => {
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
  .get('/:userId', verifyToken, async (req, res, next) => {
    const userFromToken = tokenUser(req)
    const userId = userFromToken._id
    User.findById(userId)
    .populate('currentlyReading')
    .populate('finishedReading')
    .populate('contacts')
    .populate('clubs')
    .populate('allBooks')
    .populate('upNext')
    .exec((err, user) => {
      if(err){
        res.status(400).send(err)
        return next(err)
      } else {
        res.status(200).send(user)
      }
    })
  })

  //PUT add user to club
  .put('/:userId/club', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const clubId = req.body.clubId
    User.findByIdAndUpdate({_id: userId}, {$push: {clubs: [clubId]}})
    .exec((err, user) => {
      if(err){
        res.status(400).send(err)
        return next(err)
      } else {
        Club.findByIdAndUpdate({_id: clubId}, {$push: {clubMembers: [userId]}})
        .exec((err, club) => {
          if(err){
            res.status(400).send(err)
            return next(err)
          } 
        })
        res.status(200).send(user)
      }
    })
  })

  // PUT remove user from club
  .put('/:userId/leaveclub', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const clubId = req.body.clubId
    const user = await User.findById({_id: userId})
      let updatedClubsArr = []
      user.clubs.map(club => {
        if(club._id != clubId){
          updatedClubsArr.push(club)
        }
      })
      user.clubs = updatedClubsArr
      await user.save()
      const club = await Club.findById({_id: clubId})
      let updatedClubMembersArr = []
      club.clubMembers.map(member => {
        if(member._id != userId){
          updatedClubMembersArr.push(member)
        }
      })
      club.clubMembers = updatedClubMembersArr
      await club.save()
      res.status(200).send(user)
  })
  //PUT add user to contacts
  .put('/:userId/contact', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const contactId = req.body.contactId
    User.findByIdAndUpdate({_id: userId}, {$push: {contacts: [contactId]}})
    .exec((err, user) => {
      if(err){
        res.status(400).send(err)
        return next(err)
      } else {
        res.status(200).send(user)
      }
    })
  })

  // PUT remove user from contacts
  .put('/:userId/dropcontact', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const contactId = req.body.contactId
    const user = await User.findById({_id: userId})
      let updatedContactsArr = []
      user.contacts.map(contact => {
        if(contact._id != contactId){
          updatedContactsArr.push(contact)
        }
      })
      user.contacts = updatedContactsArr
      await user.save()
      res.status(200).send(user)
  })

  

export default router