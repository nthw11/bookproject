import express from 'express'
import Club from '../models/Club.js'
import User from '../models/User.js'
import Board from '../models/Board.js'
import { verifyToken } from '../authentication/verifyToken.js'
const router = express.Router()

router
// POST add club by userId, add new club to user's "clubs" array
  .post('/:userId', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const {
      clubName,
      publicClub
    } = req.body
    new Board({
      boardName: `${clubName} Board`
    }).save(async (err, board) => {
      if(err){
        return next(err)
      } else {
        // res.status(200)
        new Club({
          clubName: clubName,
          clubOwner: userId,
          clubMembers: [userId],
          clubBoards: [board],
          publicClub: publicClub
        }).save((err, club) => {
          if(err){
            return next(err)
          } else {
            res.status(200).send(club)
            
            User.findByIdAndUpdate({_id: userId}, { $push: {clubs: [club._id]}}, {new: true})
            .exec((err, club) => {
              if(err) return next(err)
              // res.status(200).send(club).end()
            })
          }
        })
      }
    })
    })

  // GET find club by club name
  .get('/name/:clubName', verifyToken, async (req, res, next) => {
    const searchClubName = req.params.clubName
    Club.find({ clubName: { $regex: searchClubName, $options: "i"} })
    .exec((err, club) => {
      if(err){
        res.status(400).send(err)
        return next(err)
      } else {
        res.status(200).send(club)
      }
    })
  })

  // GET find club by club id
  .get('/id/:clubId', verifyToken, async (req, res, next) => {
    const clubId = req.params.clubId
    Club.find({ _id: clubId})
    // .populate('clubBoards')
    .populate({
      path: 'clubBoards',
      model: 'Board',
      populate: {
        path: 'boardMessages',
        model: 'Message'
      }
    })

    .exec((err, club) => {
      if(err){
        res.status(400).send(err)
        return next(err)
      } else {
        res.status(200).send(club)
      }
    })
  })
  
  // POST add new board to club
  .post('/:clubId/addBoard', verifyToken, async (req, res, next) => {
    const clubId = req.params.clubId
    const boardName = req.body.boardName
    const newBoard = new Board({
      boardName: boardName
    }).save(async (err, board) => {
      if(err){
        return next(err)
      } else {
      Club.findByIdAndUpdate(clubId, {$push: {clubBoards: [board._id]}}, {new: true})
      .exec((err, club) => {
        if(err){
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(200).send(club)
        }
      })
    }
  })
})

// DELETE board from club
.delete('/:clubId/:boardId', verifyToken, async (req, res, next) => {
  const clubId = req.params.clubId
  const boardId = req.params.boardId
  const club = await Club.findById(clubId)
  const updatedArray = []
  club.clubBoards.filter((board) => {
    if(board._id != boardId){
      updatedArray.push(board)
    }
  })
  club.clubBoards = updatedArray
  await club.save()
  res.send(club).status(204).end()
  
})


export default router