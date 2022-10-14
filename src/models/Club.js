import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const ClubSchema = new Schema({
  clubName: { type: String, required: true},
  clubOwner: {type: Schema.Types.ObjectId, ref: 'User'},
  clubMembers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  clubBoards: [{type: Schema.Types.ObjectId, ref: 'Board'}],
})

module.exports = mongoose.model('Club', ClubSchema)