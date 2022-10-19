import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const CommentSchema = new Schema({
  commentAuthor: {type: Schema.Types.ObjectId, ref: 'User'},
  commentTimestamp: {type: Date},
  commentText: {type: String}
})

export default mongoose.model('Comment', CommentSchema)