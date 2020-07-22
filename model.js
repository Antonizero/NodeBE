const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const todoSchema = new Schema({
  body: { type: String, required: true },
  done: { type: Boolean, required: true },
});

module.exports = mongoose.model('Todo', todoSchema);