const appRouter = require('express').Router()
appRouter.get('', (req, res) => {
  res.send('<h1>Hello Person App!</h1>')
})


module.exports = { appRouter }