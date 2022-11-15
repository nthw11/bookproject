import jsonwebtoken from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req.header('token')

  if(!token) return res.status(401).send('Access Denied')

  try{
    const verified = jsonwebtoken.verify(token, process.env.AUTH_SECRET)
    req.user = verified
    next()
  } catch (err){
    res.status(400).send('Invalid Token')
  }
}

export { verifyToken }