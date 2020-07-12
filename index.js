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

app.get('/todo/:id', (req, res, next) => {
    const id = req.params.id;
    Todo.findById(id)
        .then(todo => {
            if (todo) {
                res.status(200).json(todo)
                next()
            } else {
                res.status(400).json({message: 'there was an error getting this item'})
                next()
            }
        })
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

app.put('/todo/:id', (req, res, next) => {
    const updatedTitle = req.body.title;
    const updatedBody = req.body.body;
    const id = req.params.id;
    Todo.findById(id)
        .then(todo => {
            if (!todo) {
                res.status(400).json({message: 'could not find the todo to modify'});
                next();
            } else {
                todo.title = updatedTitle;
                todo.body = updatedBody;
                todo.save()
                    .then(() => {
                        res.status(200).json({message: 'succesfully updated todo'});
                        next();
                    })
                    
            }
        })
        .catch(e => console.log(e));
})

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('database connected')
        app.listen(process.env.PORT)
    })
    .catch(error => console.log(error));

