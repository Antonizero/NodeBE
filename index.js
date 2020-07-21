require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const Todo = require('./model');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/todos', (req, res, next) => {
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

// app.get('/todo/:id', (req, res, next) => {
//     const id = req.params.id;
//     Todo.findById(id)
//         .then(todo => {
//             if (todo) {
//                 res.status(200).json(todo)
//                 next()
//             } else {
//                 res.status(400).json({message: 'there was an error getting this item'})
//                 next()
//             }
//         })
// })

app.post('/todo', (req, res, next) => {
    const data = req.body.data;
    if (typeof data === 'string') {
        const todo = new Todo({ body: data });
        todo.save()
            .then(() => {
                res.status(200).json({message: 'todo successfully created'});
                next();
            })
            .catch(e => console.log(e));
        
    } else {
        res.status(400).json({message: 'something went wrong'});
        next();
    }
})

app.put('/todo/:id', (req, res, next) => {
    const updatedData = req.body.data;
    const id = req.params.id;
    Todo.findById(id)
        .then(todo => {
            if (!todo) {
                res.status(400).json({message: 'could not find the todo to modify'});
                next();
            } else {
                todo.body = updatedData;
                todo.save()
                    .then(() => {
                        res.status(200).json({message: 'succesfully updated todo'});
                        next();
                    })
                    
            }
        })
        .catch(e => console.log(e));
})

app.delete('/todo/:id', (req, res, next) => {
    const id = req.params.id;
    Todo.findById(id)
        .then(todo => {
            if (!todo) {
                res.status(400).json({message: 'todo not existing'});
                next();
            } else {
                Todo.deleteOne({_id: id})
                    .then(() => {
                        res.status(200).json({message: 'todo succesfully deleted'});
                        next();
                    })
                    .catch(e => console.log(e))
            }
            
        })
})

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(process.env.PORT))
    .catch(error => console.log(error));

