const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

app.get('/info', (request, response) => {
    Person.find({}).count((err, amountOfPeople) => {
        if(err) return console.log(err);
        date = new Date()
        response.send(`<p>Phonebook has info for ${amountOfPeople} people</p><p>${date}</p>`)
    });
})

app.post('/api/persons', (request, response, next) => {
    const { body } = request

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson.toJSON())
        })
        .catch((error) => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            if(!result){
                response.status(404).end();
            }else{
                response.status(204).end();
            }
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})