module.exports = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
  res.setHeader('Access-Control-Allow-Methods', ' POST, PATCH, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Length, X-Requested-With')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  if ('OPTIONS' == req.method) {
    res.sendStatus(200)
  }
  else {
    next()
  }
}