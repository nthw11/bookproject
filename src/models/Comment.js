import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const CommentSchema = new Schema({
  commentAuthor: {type: Schema.Types.ObjectId, ref: 'User'},
  commentTimestamp: {type: Date},
  commentText: {type: String}
})

module.exports = mongoose.model('Comment', CommentSchema)