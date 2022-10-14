import mongoose from 'mongoose';
require('dotenv').config()

const dbConnection = process.env.MONGO_DB_CONNECTION

const connectDB = async () => {
  try {
    await mongoose.connect(dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`DATABASE CONNECTED`)
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

module.exports = connectDB