// model/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  span: { type: String },
  image: { type: String },
  category: { type: String, enum: ['candles', 'perfumes', 'handmade'], required: true }
});

module.exports = mongoose.model('Product', productSchema);
