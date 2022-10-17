import express, { response } from 'express'
import bodyParser from 'body-parser'
import {} from 'dotenv/config'
import connectDB from './src/config/db.js'

import testRoutes from './src/routes/test.js'
import userRoutes from './src/routes/user.js'
import clubRoutes from './src/routes/club.js'
import boardRoutes from './src/routes/boards.js'

const app = express()
const PORT = 8000

connectDB()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  next()
})

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)

app.use(bodyParser.json())

app.use("/test", testRoutes)
app.use("/user", userRoutes)
app.use("/club", clubRoutes)
app.use("/board", boardRoutes)

export default app.listen(PORT, () =>{ 
  console.log(`app is listening on port ${PORT}`)
})