import mongoose, { Schema as _Schema, model, mongo } from "mongoose";
const Schema = _Schema
const AuthorSchema = './Author.js'

const BookSchema = new Schema({
  title: {type: String, required: true},
  subtitle: {type: String},
  authors: [AuthorSchema],
  pageCount: {type: Number},
  publishedDate: { type: Date},
  imageLink: {type: String},
  description: {type: String},
  userRating: {type: Number, min: 0, max: 5},
  tags: [{type: String},],
  notes:[String]

})

export default mongoose.model('Book', BookSchema)