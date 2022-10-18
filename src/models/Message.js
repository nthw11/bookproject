import { Schema as _Schema, model } from "mongoose";
const CommentSchema = './Comment.js'
const Schema = _Schema

const MessageSchema = new Schema({
  messageAuthor: {type: Schema.Types.ObjectId, ref: 'User' },
  messageText: {type: String},
  messageTimestamp: {type: Date},
  messageTags: [{type: String}],
  messageComments: [CommentSchema]
})

module.exports = mongoose.model('Message', MessageSchema)