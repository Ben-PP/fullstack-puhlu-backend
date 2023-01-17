require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const logger = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



const app = express()

app.use(cors())
app.use(express.json())
morgan.token('person', (req) => {
    return JSON.stringify(req.body)
})
app.use(logger(':method :url :status :res[content-length] - :response-time ms :person',{
    skip: (req,res) => {
        return req.method !== 'POST'
    }
}))
app.use(logger('tiny',{
    skip: (req,res) => {
        return req.method === 'POST'
    }
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.random().toString(16)
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        return response.json(person)
    } else {
        return response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    persons = persons.filter(p => p.id !== id)

    return response.status(204).end()
})

app.get('/info', (request, response) => {
    response.end(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>    
    `)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})