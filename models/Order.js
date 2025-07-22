const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  products: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1
      },
      image: String
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  giftMessage: {
    type: String,
    default: ""
  },
  discountCode: {
    type: String,
    default: ""
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'vodafone_cash', 'card'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    notes: String
  },
  receiptImage: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('Order', orderSchema);
