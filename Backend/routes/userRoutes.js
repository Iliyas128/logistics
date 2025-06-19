const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Order = require('../models/Order')
const userController = require('../controllers/userController')

// Registration and verification
router.post('/register', userController.registerUser)
router.post('/verify-otp', userController.verifyOtp)

// Login
router.post('/login', userController.loginUser)

// Middleware для проверки авторизации пользователя
const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '')
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findOne({ _id: decoded.id })

		if (!user) {
			throw new Error()
		}

		req.user = user
		next()
	} catch (error) {
		res.status(401).json({ message: 'Пожалуйста, авторизуйтесь' })
	}
}

// Регистрация пользователя
router.post('/register', async (req, res) => {
	try {
		const user = new User(req.body)
		await user.save()
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
		res.status(201).json({ user, token })
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

// Вход пользователя
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		if (!user || !(await user.comparePassword(req.body.password))) {
			throw new Error('Неверные учетные данные')
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
		res.json({ user, token })
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

// Получить профиль пользователя
router.get('/profile', auth, async (req, res) => {
	try {
		res.json(req.user)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Получить заказы пользователя
router.get('/orders', auth, async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.user._id }).sort({
			createdAt: -1,
		})
		res.json(orders)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Обновить профиль пользователя
router.patch('/profile', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['username', 'email', 'phone', 'address']
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) {
		return res.status(400).json({ message: 'Недопустимые поля для обновления' })
	}

	try {
		updates.forEach(update => (req.user[update] = req.body[update]))
		await req.user.save()
		res.json(req.user)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

module.exports = router
