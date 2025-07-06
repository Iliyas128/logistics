const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const transporter = require('../utils/mailer');

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

    // Обновление цены, если передана
    if (typeof req.body.price !== 'undefined') {
      order.price = req.body.price;
    }

    // Обновление статуса, если передан
    if (req.body.status) {
      order.status = req.body.status;
      order.statusHistory.push({
        status: req.body.status,
        location: req.body.location,
        city: req.body.city,
        comment: req.body.comment,
        date: new Date()
      });
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Редактировать услуги заказа (и пересчитать цену)
router.patch('/orders/:id/services', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    // Обновляем услуги и пересчитываем цену
    const { price, extraServices } = require('../models/../utils/tariffUtils').calculateOrderPrice({
      ...order.toObject(),
      ...req.body // новые услуги и параметры
    });
    order.extraServices = extraServices;
    order.price = price;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить все заказы (только для администратора, с фильтрацией по городам)
router.get('/orders', auth, async (req, res) => {
  try {
    const { receiverCity, senderCity } = req.query;
    const filter = {};
    if (receiverCity) filter.receiverCity = receiverCity;
    if (senderCity) filter.senderCity = senderCity;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать заказ с ручным номером (только для администратора)
router.post('/orders', auth, async (req, res) => {
  try {
    if (!req.body.orderNumber) {
      return res.status(400).json({ message: 'Номер заказа обязателен' });
    }
    // Проверка уникальности номера
    const exists = await Order.findOne({ orderNumber: req.body.orderNumber });
    if (exists) {
      return res.status(400).json({ message: 'Этот номер заказа уже занят' });
    }
    // Расчёт цены и услуг
    const { price, extraServices } = require('../utils/tariffUtils').calculateOrderPrice(req.body);
    const order = new Order({
      ...req.body,
      price,
      extraServices
    });
    await order.save();
    // Отправка email админу или на указанный email
    if (process.env.ADMIN_ORDER_EMAIL) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_ORDER_EMAIL,
        subject: `Создан заказ №${order.orderNumber}`,
        text: `Заказ №${order.orderNumber} успешно создан. Статус: ${order.status}. Сумма: ${order.price} тг.`
      });
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 