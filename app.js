const express = require('express')
require('express-async-errors')
require('mongoose-unique-validator')
const cors = require('cors')
const morgan = require('morgan')
const { requestLogger, errorHandler, unknownEndpoint, userExtractor } = require('./utils/middleware')
const { appRouter } = require('./controllers/app')
const { personRouter } = require('./controllers/person')
const { blogsRouter } = require('./controllers/blogs')
const mongoose = require('mongoose')
const { connect } = require('mongoose')
const { info, error } = require('./utils/logger')
const { MONGODB_URI } = require('./utils/conf')
const usersRouter = require('./controllers/user')
const { loginRouter } = require('./controllers/login')

const app = express()
mongoose.set('strictQuery', false)
connect(MONGODB_URI)
  .then(result => {
    info('connected to MongoDB', result.STATES.connected)
  })
  .catch((err) => {
    error('error connecting to MongoDB:', err.message)
  }).finally()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('data', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))

app.use(requestLogger)
app.use('/api', appRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/persons', personRouter)
app.use('/api/blogs', userExtractor, blogsRouter)
app.use(errorHandler)
app.use(unknownEndpoint)
module.exports = app
