import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'

import * as dotenv from 'dotenv'
dotenv.config()
const secret = process.env.AUTH_SECRET

const genPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

const validatePassword = async (passwordString, passwordHash ) => {
  const validatedPassword = await bcrypt.compare(passwordString, passwordHash)
  return validatedPassword
  
}

const issueJWT = (user) => {
  const _id = user._id
  const signedToken = jsonwebtoken.sign({_id}, secret)
  return signedToken
}

export {genPassword, validatePassword, issueJWT}