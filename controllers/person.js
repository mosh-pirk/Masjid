const personsRouter = require('express').Router()
const Persons = require('../models/person')

// get all persons
personsRouter.get('', async (request, response) => {
  const persons = await Persons.find({})
  response .status(200).json(persons)
})
// add person
personsRouter.post('', async (request, response) => {
  const person = new Persons(returnPersonObject(request, response, false))
  const savedData = person.save()
  response.json(savedData).status(200)
})
// delete one person
personsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Persons.findByIdAndDelete(id)
  response.status(204).end()
})
// get one person
personsRouter.get('/:id', async (request, response) => {
  const person = await Persons.findById(request.params.id)
  response.status(200).json(person)
})
// edit person
personsRouter.put('/:id', async (request, response) => {
  const person = await Persons.findByIdAndUpdate(request.params.id, returnPersonObject(request, response, true))
  response.status(200).json(person)
})

const returnPersonObject = (request, response, edit) => {
  const body = request.body
  return edit
    ?
    { number: body.number }
    : {
      name: body.name,
      number: body.number,
    }
}

module.exports = { personRouter: personsRouter }
