const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { generateOrderNumber } = require('../utils/orderNumberGenerator');

// Создать новый заказ (требуется авторизация)
router.post('/', auth, async (req, res) => {
  try {
    // Генерируем номер заказа
    const orderNumber = await generateOrderNumber();
    
    const order = new Order({
      ...req.body,
      orderNumber, // Добавляем номер
      userId: req.user._id,
      senderName: req.user.username,
      senderPhone: req.user.phone,
      senderAddress: req.user.address
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить все заказы пользователя
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить конкретный заказ пользователя
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отследить заказ по номеру (публичный роут)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 