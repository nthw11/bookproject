import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema

const BookSchema = new Schema({
  bookName: {type: String, required: true},
  author: [{
    authorFName: {type: String},
    authorMName: {type: String},
    authorLName: {type: String}
  }],
  pageCount: {type: Number},
  publishedDate: { type: Date},
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

module.exports = mongoose.model('Book', BookSchema)