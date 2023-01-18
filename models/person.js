const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.DATABASE_URL

console.log('Connecting to MongoDB')
// eslint-disable-next-line no-unused-vars
mongoose.connect(url).then(result => {
  console.log('Connected to MongoDB')
}).catch(error => {
  console.log('Error connecting to MongoDB: ', error.message)
})

const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        if (v.length === 9) {
          console.log(v.length)
          return /^[0-9]{2,3}-[0-9]{5,6}$/.test(v)
        }
        return false
      }
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)