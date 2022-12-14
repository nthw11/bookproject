import mongoose, { Schema as _Schema, model, mongo } from "mongoose";
const Schema = _Schema


const UserSchema = new Schema({
  username: { type: String, reqired: true, unique: true, minLength: 4, maxLength: 24},
  email: { type: String, required: true, unique: true},
  firstname: { type: String, required: true},
  lastname: {type: String, required: true},
  phone: { type: String},
  avatarUrl: {type: String},
  contacts: [{type: Schema.Types.ObjectId, ref: 'User'}],
  blockedContacts: [{type: Schema.Types.ObjectId, ref: 'User'}],
  clubs: [{type: Schema.Types.ObjectId, ref: 'Club'}],
  allBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  currentlyReading: {type: Schema.Types.ObjectId, ref: 'Book'},
  finishedReading: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  upNext: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  bookshelves: [{
    shelfName: {type: String, required: true},
    shelfContents: [{type: Schema.Types.ObjectId, ref: 'Book'}]
  }],
  tags: [{ type: String}],
  password: {type: String, required: true, minLength: 6}
  // hash: {type: String},
  // salt: {type: String}
})

export default mongoose.model('User', UserSchema)