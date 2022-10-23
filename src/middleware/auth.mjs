import jwt from 'jsonwebtoken'

export const checkToken = (req, res, next) => {
  const token = req.cookies.auth

  if (token) {
    jwt.verify(token, process.env.JWT_secret, (err, decoded) => {
      if (err) {
        return res.send('Token is not valid')
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.send('Auth token is not supplied')
  }
}
