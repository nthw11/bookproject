import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const BoardSchema = new Schema({
  boardName: {type: String, required: true},
  boardMessages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
})

export default mongoose.model('Board', BoardSchema)