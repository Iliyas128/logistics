const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');

// Middleware для проверки авторизации
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ _id: decoded.id });
    
    if (!admin) {
      throw new Error();
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Пожалуйста, авторизуйтесь' });
  }
};

// Регистрация администратора
router.post('/register', async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.status(201).json({ admin, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Вход администратора
router.post('/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin || !(await admin.comparePassword(req.body.password))) {
      throw new Error('Неверные учетные данные');
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ admin, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Обновить статус заказа
router.patch('/orders/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить все заказы (только для администратора)
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 