require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

// app.get('/info', (request, response) => {
//   const now = new Date().toString()
//   response.send(
//     `
//     <p>Phonebook has info for ${persons.length} people</p>
//     <p>${now}</p>
//     `
//   )
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// app.get('/api/persons/:id', (request, response) => {
//   Person.findById(request.params.id).then(person => {
//     response.json(person)
//   })
// })

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(p => p.id !== id)

//   response.status(204).end()
// })

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // const nameExists = persons.find(p => p.name === body.name)
  // if (nameExists) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})