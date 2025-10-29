require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // HTML fayllarni berish uchun

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// DB
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB ulandi'))
  .catch(err => console.error('DB xatosi:', err));

// Modellar
const Course = mongoose.model('Course', new mongoose.Schema({
  name: String, description: String, duration: String, price: Number, teacher: String, schedule: String
}, { timestamps: true }));

const Student = mongoose.model('Student', new mongoose.Schema({
  name: String, phone: String, course: String, message: String, status: { type: String, default: 'yangi' }
}, { timestamps: true }));

// Email funksiyasi
async function sendEmail(student) {
  const mailOptions = {
    from: `"O'quv Markazi" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Yangi Ariza: ${student.name}`,
    html: `<h2>Yangi ariza!</h2><p><b>Ism:</b> ${student.name}<br><b>Telefon:</b> ${student.phone}<br><b>Kurs:</b> ${student.course}</p>`
  };
  try { await transporter.sendMail(mailOptions); console.log('Email yuborildi'); } 
  catch (err) { console.error('Email xatosi:', err); }
}

// API
app.get('/api/courses', async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
});

app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    sendEmail(student);
    res.status(201).json({ message: 'Ariza qabul qilindi!', data: student });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/students', async (req, res) => {
  if (req.headers['admin-id'] !== process.env.ADMIN_ID) return res.status(403).json({ error: 'Ruxsat yo‘q' });
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
});

app.put('/api/students/:id', async (req, res) => {
  if (req.headers['admin-id'] !== process.env.ADMIN_ID) return res.status(403).json({ error: 'Ruxsat yo‘q' });
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
});

app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti`));