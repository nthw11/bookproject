import { ObjectId } from "mongodb";
import mongoose, { Schema as _Schema, model, mongo } from "mongoose";
const Schema = _Schema

const BookSchema = new Schema({
  _id: {type: String},
  title: {type: String, required: true},
  subtitle: {type: String},
  authors: [{
    authorFName: String,
    authorMName: String,
    authorLName: String
  }],
  pageCount: {type: Number},
  publishedDate: { type: Date},
  description: {type: String},
  series: {type: String},
  categories: [{type: String}],
  imageLinks:{
    smallThumbnail: {type: String},
    thumbnail: {type: String},
    small: {type: String},
    medium: {type: String},
    large: {type: String},
    extraLarge: {type: String},
  },
  language: {type: String},
  publisher: {type: String},
  retail: {
    saleability: {type: String},
    onSaleDate: { type: Date},
    listPrice: {
      amount: {type: Number},
      currencyCode: {type: String},
    },
    retailPrice: {
      amount: {type: Number},
      currencyCode: {type: String},
    },
    buyLink: {type: String},
  },
  userRating: {type: Number},
  tags: [{type: String},]

})

export default mongoose.model('Book', BookSchema)