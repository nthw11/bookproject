import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const MessageSchema = new Schema({
  messageAuthor: {type: Schema.Types.ObjectId, ref: 'User' },
  messageText: {type: String},
  messageTimestamp: {type: Date},
  messageTags: [{type: String}],
  messageComments: [
    {
      commentText: {type: String},
      commentUser: {type: String},
      commentTimestamp: {type: Date}
    }
  ]
})

export default mongoose.model('Message', MessageSchema)