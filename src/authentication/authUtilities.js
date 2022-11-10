import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
// import * as dotenv from 'dotenv'
// dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pathToKey = path.join(__dirname, '../..', 'id_rsa_priv.pem')

const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8')

const validPassword = (password, hash, salt) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === hashVerify
}

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString('hex')
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 
    'sha512').toString('hex')

    return {
      salt: salt,
      hash: genHash
    }
}

const issueJWT = (user) => {
  const _id = user._id
  const expiresIn = '1d'
  const payload = {
  sub: _id,
  iat: Date.now()
  }

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {expiresIn: expiresIn, algorithm: 'RS256'})

  return{
    token: "Bearer " + signedToken,
    expires: expiresIn,
    user:user
  }
}

export {validPassword, genPassword, issueJWT}