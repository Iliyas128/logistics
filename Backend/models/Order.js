const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Отправитель
  senderCompany: String,
  senderContact: String,
  senderCountry: String,
  senderCity: String,
  senderIndex: String,
  senderAddress: String,
  senderPhone: String,

  // Получатель
  receiverCompany: String,
  receiverContact: String,
  receiverCountry: String,
  receiverCity: String,
  receiverIndex: String,
  receiverAddress: String,
  receiverPhone: String,

  // Услуги и опции
  serviceExpress: Boolean,
  serviceNotification: Boolean,
  servicePersonal: Boolean,
  paymentCondition: String, // отправитель/получатель/3-я сторона
  paymentForm: String,      // наличные/по счету
  cargoDescription: String,

  // Дополнительная информация
  places: String,
  weight: String,
  volumeWeight: String,
  dimensions: String,
  declaredValue: String,
  additionalService: String,
  additionalPacking: String,
  deliveryPoint: String,

  // Привязка к пользователю
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Статус и дата
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