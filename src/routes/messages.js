import express from 'express'
import Message from '../models/Message.js'
import { verifyToken } from '../authentication/verifyToken.js'
const router = express.Router()
router

//GET comments by messageId
.get('/:messageId', verifyToken, async (req, res, next) => {
  const messageId = req.params.messageId
  Message.findById(messageId)
  .populate({ path: 'messageComments'})
  .exec((err, message) => {
    if(err){
      return next(err)
    } else {
      res.status(200).send(message)
    }
  })
})

//POST add comment by messageId
.post('/:messageId', verifyToken, async (req, res, next) => {
  const messageId = req.params.messageId
  const {userId, text} = req.body
  if(text != null){
    const newComment = {
      commentText: text, 
      commentUser: userId,
      commentTimestamp: new Date()}
    const messageToUpdate = Message.findByIdAndUpdate({_id:messageId},{$push: {messageComments: [newComment]}}, function(err, result){
      if(err){
        return next(err)
      } else {
        // res.status(200).send(result)
        Message.findById(messageId)
        .populate('messageComments')
        .exec((err, message) => {
          if(err){
            return next(err)
          } else {
            res.status(200).send(message)
          }
        })
      }
  })
  }
  })

//PUT edit comment by messageId
// .put('/:messageId/:commentId', async (req, res, next) => {
//   const {messageId, commentId} = req.params
//   const {userId, text} = req.body
//   if(text != null){
//     const messageToUpdate = Message.findById({_id: messageId}, function(err, result){
//       result.messageComments.map(comment => {
//         if(comment._id == commentId){
//           comment.commentText = text
//           comment.commentTimestamp = new Date()
//         }
//       })
//       messageToUpdate.save()
      
//     })
//     .exec((err, message) =>{
//       if(err){
//         res.status(400).send(err)
//       } else {
//         res.status(200).send(message)
//       }
//     })


//   }
// })

//DELETE comment by messageId
.delete('/:messageId/:commentId', verifyToken, async (req, res, next) => {
  const {messageId, commentId} = req.params
  const messageToUpdate = await Message.findById({_id: messageId})
    let updatedMessageCommentsArray = []
    messageToUpdate.messageComments.map(comment => {
      if(comment._id != commentId){
        updatedMessageCommentsArray.push(comment)
      }
    })
    messageToUpdate.messageComments = updatedMessageCommentsArray
    Message.findById(messageId).exec(
    messageToUpdate.save((err, message) => {
      if(err){
        return next(err)
      } else {
        res.status(200).send(message)
      }
    })
    
    )
})

export default router