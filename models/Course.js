const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true }, // masalan: "3 oy"
  price: { type: Number, required: true },
  teacher: { type: String, required: true },
  schedule: { type: String }, // masalan: "Dush-Juma, 18:00"
  image: { type: String, default: 'default-course.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);