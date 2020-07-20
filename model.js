const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const todoSchema = new Schema({
  body: String,
});

module.exports = mongoose.model('Todo', todoSchema);