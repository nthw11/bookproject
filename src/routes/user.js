import express from 'express'
import User from '../models/User.js'
import Club from '../models/Club.js'
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
      password,
      bookshelves: [
        {shelfName: 'upNext', shelfContents: []},
        {shelfName: 'finishedReading', shelfContents: []},
        {shelfName: 'allBooks', shelfContents: []}
      ]
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
      currentlyReading,
      finishedReading,
      password
    } = req.body
    const update = {
      firstname,
      lastname,
      email,
      phone,
      avatarUrl,
      currentlyReading,
      finishedReading,
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

  // PUT Edit user book info
  .put('/:userId/book-update', (req, res, next) => {
    const userId = req.params.userId
    const {
      newCurrentlyReading,
      newFinishedReading,
      newUpNext
    } = req.body
    
    User.findById({_id: userId}, function (err, result) {
      if(newCurrentlyReading != null){
        result.currentlyReading = newCurrentlyReading
      } 
      if(newFinishedReading != null){
        result.finishedReading.push(newFinishedReading)
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

  //PUT add user to club
  .put('/:userId/club', async (req, res, next) => {
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
  .put('/:userId/leaveclub', async (req, res, next) => {
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
  .put('/:userId/contact', async (req, res, next) => {
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
  .put('/:userId/dropcontact', async (req, res, next) => {
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