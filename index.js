require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Todo = require('./model')

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    Todo.find({}, (err, todos) => {
        if (!err) {
            res.status(200).json(todos)
            next()
        } else {
            res.status(400).json({message: 'something went wrong when getting all todos'})
            next()
        }
    });
})

app.post('/todo', (req, res, next) => {
    const { title, body } = req.body;
    console.log({title, body});
    if (title && body) {
        const todo = new Todo({title, body})
        todo.save()
        res.status(200).json({message: 'you succesfully connect to the server and wrote to database'});
        next();
    } else {
        res.status(400).json({message: 'something went wrong when posting todo'});
        next()
    }
})

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('database connected')
        app.listen(process.env.PORT)
    })
    .catch(error => console.log(error));

