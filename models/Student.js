const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['yangi', 'qabul qilindi', 'rad etildi'], default: 'yangi' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);