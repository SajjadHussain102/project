const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const Task = require('../models/Task');

router.route('/').get(auth, getTasks).post(auth, createTask);
router.route('/:id').get(auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
}).put(auth, updateTask).delete(auth, deleteTask);

module.exports = router;