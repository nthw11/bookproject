import mongoose, { Schema as _Schema, model, mongo } from "mongoose";
const Schema = _Schema

const AuthorSchema = new Schema({
    authorFName: {type: String},
    authorMName: {type: String},
    authorLName: {type: String}
})

export default mongoose.model('Author', AuthorSchema)