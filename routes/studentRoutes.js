const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { adminOnly } = require('../middleware/auth');

// Yangi talaba qo'shish (frontenddan)
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Ariza qabul qilindi!', data: student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Barcha arizalarni ko'rish
router.get('/', adminOnly, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Arizani yangilash (masalan, status)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Ariza topilmadi' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;