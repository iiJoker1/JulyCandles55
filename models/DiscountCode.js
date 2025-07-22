const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percent', 'shipping', 'gift_product'], required: true },
  value: Number, // نسبة الخصم مثلاً 20
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DiscountCode', discountCodeSchema);
