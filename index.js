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
        if (err) return console.log(err);
        date = new Date()
        response.send(`<p>Phonebook has info for ${amountOfPeople} people</p><p>${date}</p>`)
    });
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'Enter name and number' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    Person
        .find({ name: person.name })
        .then(result => {
            if (result.length > 0) {
                response.status(400).json({ error: 'This person already exists in the phonebook' })
            } else {
                person
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        })
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
            if (!result) {
                response.status(404).end();
            } else {
                response.status(204).end();
            }
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformed id' })
        })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})