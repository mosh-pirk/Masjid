const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('', async (request, response) => {
  const { username, name, password } = request.body
  if (username && username.length < 3) {
    throw response.status(422).json({ error: 'Username most be at less 3 characters' })
  }

  if (password && password.length < 3) {
    throw response.status(422).json({ error: 'Password most be at less 3 characters' })
  }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})
// todo: remove or add role
usersRouter.get('', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.status(200).json(users)
})

module.exports = usersRouter