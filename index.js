const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        id: Math.random().toString(16),
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: Math.random().toString(16),
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: Math.random().toString(16),
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: Math.random().toString(16),
        name: 'Mary Poppendick',
        number: '39-23-6423122',
    },
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    console.log(person)
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)
    if (person) {
        return response.json(person)
    } else {
        return response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)

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