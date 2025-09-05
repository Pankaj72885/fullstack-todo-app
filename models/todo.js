// import mongoose dependency
const mongoose = require('mongoose');

// The blue print for out todo items
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, // This field must exist
  },
  isCompleted: {
    type: Boolean,
    default: false, // If not provided, it will be false
  },
});

// Create the todo (model) from the blue print
const Todo = mongoose.model('Todo', todoSchema);

// Export the Todo so we can use it in our app
module.exports = Todo;
