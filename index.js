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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const person = new Person({
        id: Math.random().toString(16),
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        console.log(`Person ${savedPerson.name} saved!`)
        response.json(savedPerson)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }).catch(error => next(error))
})

app.put('/api/persons/:id',(request, response, next) => {
    const body = request.body

    const person = {
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
        response.json(updatedPerson)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({}).count().then(count => {
        response.end(`
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>    
        `)
    }).catch(error => next(error))
    
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})