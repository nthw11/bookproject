import express, { response } from 'express'
import bodyParser from 'body-parser'
import {} from 'dotenv/config'
import connectDB from './src/config/db.js'

import testRoutes from './src/routes/test.js'
import userRoutes from './src/routes/user.js'
import clubRoutes from './src/routes/club.js'
import boardRoutes from './src/routes/boards.js'
import bookRoutes from './src/routes/books.js'
import messageRoutes from './src/routes/messages.js'
import loginRoutes from './src/routes/login.js'

const app = express()
// const PORT = process.env.PORT || 8000

connectDB()

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // handle OPTIONS method
  if ('OPTIONS' == req.method) {
      return res.sendStatus(200);
  } else {
      next();
  }
});
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
//   )
//   // if ('OPTIONS' == req.method){
//     return res.sendStatus(200)
//   // }
// })

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use("/test", testRoutes)
app.use("/user", userRoutes)
app.use("/login", loginRoutes)
app.use("/user/book", bookRoutes)
app.use("/club", clubRoutes)
app.use("/board", boardRoutes)
app.use("/message", messageRoutes)

export default app.listen(process.env.PORT || 8000, () =>{ 
  // console.log(`app is listening on port ${PORT}`)
})