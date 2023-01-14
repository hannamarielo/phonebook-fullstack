const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hannamarielo:${password}@cluster0.intedwg.mongodb.net/personApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
if (process.argv[2] && process.argv[3]) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    console.log(`Added person named ${person.name} with number ${person.number} to the phonebook`);

    person
        .save()
        .then(result => {
            mongoose.connection.close();
        })
} else {
    console.log('Phonebook:');
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number);
            })
            mongoose.connection.close();
        })
}