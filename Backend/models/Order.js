const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Номер заказа (6-значный)
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Отправитель
  senderCompany: {
    type:String,
    required:true,},
  senderContact:{
    type:String,
    required:true},
  senderCountry:{
    type:String,
    required:true},
  senderCity:{
    type:String,
    required:true},
  senderIndex: String,
  senderAddress:{
    type:String,
    required:true},
  senderPhone:{
    type:String,
    required:true},

  // Получатель
  receiverCompany:{
    type:String,
    required:true},
  receiverContact:{
    type:String,
    required:true},
  receiverCountry:{
    type:String,
    required:true},
  receiverCity:{
    type:String,
    required:true},
  receiverIndex: String,
  receiverAddress:{
    type:String,
    required:true},
  receiverPhone:{
    type:String,
    required:true},

  // Услуги и опции
  extraServices: {
    type: Object, // { insurance: { selected: true, price: 500 }, ... }
    default: {}
  },
  price: {
    type: Number,
    required: true
  },
  paymentCondition: String, // отправитель/получатель/3-я сторона
  paymentForm: String,      // наличные/по счету
  cargoDescription:{
    type: String,
    required:true},

  // Дополнительная информация
  places: String,
  weight:{type:String,required:true},
  volumeWeight: String,
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  declaredValue: String,
  additionalService: String,
  additionalPacking: String,
  deliveryPoint: String,

  // Привязка к пользователю
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  // История статусов
  statusHistory: [
    {
      status: String,
      location: String,
      city: String,
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ],

  // Статус и дата
  status: {
    type: String,
    enum: ['новый', 'получен складом', 'планируется отправка', 'отправлено со склада', 'Забран у перевозчика', 'Доставлен'],
    default: 'новый'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);