import dot from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { checkToken } from './middleware/auth.mjs'

dot.config()
const app = express()
const port = process.env.PORT || 8000

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(`${process.cwd()}/public`))

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (username && password) {
    if (username === 'admin' && password === 'pass123') {
      const token = jwt.sign({ username }, process.env.JWT_secret, {
        expiresIn: '24h',
      })
      res
        .cookie('auth', token, { expire: Date.now() })
        .send('Authentication successful')
    } else {
      res.status(403).send('Incorrect username or password')
    }
  } else {
    res.status(400).send('Authentication failed')
  }
})

app.get('/unauthed', (req, res) => res.send('<p>hello</p>'))

app.get('/authed', checkToken, (req, res) => res.send('<p>authed!</p>'))

app.get('/logout', (req, res) => {
  res.clearCookie('auth')
  res.send('auth cookie cleared')
})

app.listen(port, () => console.log(`Server is listening on port: ${port}`))
