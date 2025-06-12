const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderPhone: {
    type: Number,
    required: true
  },
  senderAddress: {
    type: String,
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  receiverPhone: {
    type: Number,
    required: true
  },
  receiverAddress: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ожидает', 'в пути', 'доставлен'],
    default: 'ожидает'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema); 