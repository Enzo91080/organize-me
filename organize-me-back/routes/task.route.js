const express = require('express');
const Task = require('../models/task.model');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Créer une tâche
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = new Task({ title, description, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lire une tâche
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// insérer plusieurs tâches
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    // Vérifiez que chaque tâche a un titre
    const tasks = req.body.map((task) => {
      if (!task.title) throw new Error('Task validation failed: title is required');
      return { ...task, user: req.user.id };
    });

    const insertedTasks = await Task.insertMany(tasks);
    res.status(201).json(insertedTasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Lire toutes les tâches
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Mettre à jour une tâche
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer une tâche
// Supprimer une tâche (accessible uniquement aux administrateurs)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task.', error: err.message });
  }
});


module.exports = router;
