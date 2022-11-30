import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const ClubSchema = new Schema({
  clubName: { type: String, unique: true, required: true},
  clubOwner: {type: Schema.Types.ObjectId, ref: 'User'},
  clubMembers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  clubBoards: [{type: Schema.Types.ObjectId, ref: 'Board'}],
  // clubReading: {type: Schema.Types.ObjectId, ref: 'Book'},
  publicClub: {type: Boolean, required: true}
})

export default mongoose.model('Club', ClubSchema)