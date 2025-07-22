// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  fatherName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: String,
  avatar: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

module.exports = mongoose.model('User', userSchema);
