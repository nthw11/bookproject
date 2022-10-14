import express from 'express'
import bodyParser from 'body-parser'
require('dotenv').config()
import connectDB from './src/config/db'



const app = express()
const PORT = 8000

app.listen(PORT, () => 
console.log(`app is listening on port ${PORT}`))