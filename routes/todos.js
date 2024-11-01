const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Todo = require('../models/Todo');

const { body, validationResult } = require('express-validator');

// Route 1: Get all the Todos /api/todos/fetchalltodos Login required
router.get('/fetchalltodos', fetchuser, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// Route 2: Add a new todo using POST /api/todos/addtodo Login required
router.post(
  '/addtodo',
  fetchuser,
  [body('todo', 'Enter a valid todo').isLength({ min: 1 })],
  async (req, res) => {
    try {
      // If there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { todo } = req.body;
      const newTodo = new Todo({
        todo,
        user: req.user.id,
      });
      const saveTodo = await newTodo.save();
      res.json({ saveTodo });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server Error');
    }
  }
);
// Route 3: Update an existing todo using: PUT /api/todos/updatetodo .Login required
router.put('/updatetodo/:id', fetchuser, async (req, res) => {
  const { todo } = req.body;
  // Create a new object
  try {
    const newTodo = {};
    if (todo) {
      newTodo.todo = todo;
    }
    // Find the todo to be updated and update it
    let updateTodo = await Todo.findById(req.params.id);
    if (!updateTodo) {
      return res.status(404).send('Not Found');
    }
    if (updateTodo.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    updateTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: newTodo },
      { new: true }
    );
    res.json({ updateTodo });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// Route 4: Complete an existing todo using: PUT /api/todos/completetodo .Login required
router.put('/completetodo/:id', fetchuser, async (req, res) => {
  const { status } = req.body;
  // Create a new object
  try {
    const newTodo = {};
    if (status) {
      newTodo.status = status;
    }
    // Find the todo to be updated and update it
    let completeTodo = await Todo.findById(req.params.id);
    if (!completeTodo) {
      return res.status(404).send('Not Found');
    }
    if (completeTodo.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    completeTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: newTodo },
      { new: true }
    );
    res.json({ completeTodo });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// Route 5: Delete an existing todo using: DELETE /api/todos/deletetodo .Login required
router.delete('/deletetodo/:id', fetchuser, async (req, res) => {
  try {
    // Find the todo to be deleted and delete it
    let deleteTodo = await Todo.findById(req.params.id);
    if (!deleteTodo) {
      return res.status(404).send('Not Found');
    }
    // Allow deletion only if user owns this Todo
    if (deleteTodo.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    deleteTodo = await Todo.findByIdAndDelete(req.params.id);
    res.json({ Success: 'Todo has been deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

module.exports = router;
