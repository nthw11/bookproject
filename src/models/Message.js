import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const MessageSchema = new Schema({
  messageAuthor: {type: Schema.Types.ObjectId, ref: 'User' },
  stringAuthor: {type: String},
  messageText: {type: String},
  messageTags: [{type: String}],
  messageComments: [
    {
      commentText: {type: String},
      commentUser: {type: String},
      // commentTimestamp: {type: Date}
    },
    {timestamps: true}
  ]
},
{timestamps: true,}
)

export default mongoose.model('Message', MessageSchema)