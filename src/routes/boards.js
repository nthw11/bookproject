import express from 'express'
import Board from '../models/Board.js'
import Message from '../models/Message.js'
const router = express.Router()

router
//GET messages by boardId
  .get('/:boardId', async (req, res, next ) => {
    const boardId = req.params.boardId
    Board.findById(boardId)
    .populate('boardMessages')
    .exec((err, board) => {
      if(err){
        return next(err)
      } else {
        res.status(200).send(board)
      }
      
    })
  })

//POST add message by boardId
  .post('/:boardId', async (req, res, next) => {
    const boardId = req.params.boardId
    const {userId, text, tags} = req.body
    const newMessage = new Message({
      messageAuthor: userId,
      messageText: text,
      messageTimestamp: new Date(),
      messageTags: tags
    }).save((err, message) => {
      if(err){
        return next(err)
      } else {
        Board.updateOne(
          {_id: boardId},
          {$push: {boardMessages: [message._id]}},
          function(err, board){
            if(err){
              res.status(400).send(err)
            // } else {
            //   res.status(200).send(board)
            }
          }
        )
        res.status(200).send(message)
      }
    })
  })

//PUT edit message by boardId
  .put('/:boardId/:messageId', async (req, res, next) => {
    const {boardId, messageId} = req.params
    const { userId, text, tags } = req.body
    const messageToUpdate = Message.findById({ _id: messageId}, function(err, result){
      if(result.messageAuthor != userId){
        res.status(400).send(`You must be the message author to make edits`)
      } else {
        if(text != null){
          result.messageText = text
        }
        if(tags != null){
          result.messageTags.push(tags)
        }
        result.save((err, message) => {
          if(err){
            return next(err)
          } else {
            res.status(200).send(message)
          }
        })
      }
    })
  })

  .delete('/:boardId/:messageId', async (req, res, next) => {
    const {boardId, messageId} = req.params
    const { userId } = req.body
    Message.findById({_id: messageId}, function(err, result){
      if(result.messageAuthor != userId){
        res.status(400).send(`You must be the message author to make edits`)
      } 
    })
      const board = await Board.findById({_id: boardId})
      let updatedMessagesArr = []
      board.boardMessages.map(message => {
        if(message._id != messageId){
          updatedMessagesArr.push(message)
        }
      })
      board.boardMessages = updatedMessagesArr
      await board.save()
      Message.findByIdAndDelete(messageId)
      .exec((err) => {
        if(err){
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(204).send('message has been successfully deleted')
          // .status(204).end()
        }
      })
  })

//DELETE remove message by boardId


export default router