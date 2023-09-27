const bcrypt = require('bcrypt')
const { User } = require('../../models/user')
const supertest = require('supertest')
const app = require('../../app')
const { usersInDb } = require('../../utils/testhelpers/list_helper')
const { newUser } = require('../../utils/testhelpers/dummyData')
const mongoose = require('mongoose')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()
    const rootUser = {
      username: 'root',
      name: 'root',
      password: 'root',
    }
    const result = await api
      .post('/api/users')
      .send(rootUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.message).toContain('User validation failed: username: Error, expected `username` to be unique. Value: `root`')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('Can not create user if username is less that 3 char', async () => {
    const invalidUser = {
      username: 'xx',
      name: 'root',
      password: 'root',
    }

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(422)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('Username most be at less 3 characters')

  })

  test('Can not create user if password is less that 3 char', async () => {
    const invalidUser = {
      username: 'root',
      name: 'root',
      password: 'xx',
    }

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(422)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('Password most be at less 3 characters')

  })
})