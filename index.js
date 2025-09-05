/* eslint-disable node/prefer-global/process */
// --- SETUP ---
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo.js');

const app = express();

// --- DATABASE CONNECTION ---
// Use the MONGO_URI from your .env file
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- MIDDLEWARE ---
app.use(express.json()); // To parse JSON request bodies
app.use(express.static('public')); // To serve frontend files from the 'public' directory

// --- API ROUTES ---

// CREATE: Add a new to-do item
app.post('/todos', async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ: Get all to-do items
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE: Update a specific to-do item by its ID
app.patch('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a specific to-do item by its ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Cannot find to-do item' });
    }
    res.json({ message: 'To-do item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- SERVER START ---
// Use the PORT from your .env file, with a fallback to 3000

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
