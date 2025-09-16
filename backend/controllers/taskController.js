const Task = require('../models/Task');

// Get all tasks for user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Create task
const createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      user: req.user.id,
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Update task
const updateTask = async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

//Delete
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error('Delete error:', err.message); // Log the error for debugging
    res.status(500).send('Server error');
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };