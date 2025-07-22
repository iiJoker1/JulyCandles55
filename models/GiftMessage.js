// models/GiftMessage.js
const mongoose = require('mongoose');

const giftMessageSchema = new mongoose.Schema({
  message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GiftMessage', giftMessageSchema);
