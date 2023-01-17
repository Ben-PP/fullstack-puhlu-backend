const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
    console.log('give password as argument')
    console.log('node mongo.js <password> <name> <number>')
    process.exit(1)
}

const url = process.env.DATABASE_URL

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    return Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit(0)
    })
}

const person = new Person({
    id: Math.random().toString(16),
    name: process.argv[3],
    number: process.argv[4],
})

person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})