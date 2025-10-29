const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { adminOnly } = require('../middleware/auth');

// Barcha kurslarni olish (ommaviy)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Yangi kurs qo'shish
router.post('/', adminOnly, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Kursni yangilash
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ error: 'Kurs topilmadi' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Kursni o'chirish
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Kurs topilmadi' });
    res.json({ message: 'Kurs o‘chirildi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;