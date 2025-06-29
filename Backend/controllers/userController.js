const User = require('../models/User')
const transporter = require('../utils/mailer')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

exports.registerUser = async (req, res) => {
	try {
		const { username, password, email, phone, address } = req.body

		// Check if user exists
		const existingUsername = await User.findOne({ username })
		if (existingUsername)
			return res.status(400).json({ message: 'Username already exists' })

		const existingEmail = await User.findOne({ email })
		if (existingEmail)
			return res.status(400).json({ message: 'Email already registered' })
		if (!email.endsWith('@gmail.com') && !email.endsWith('@icloud.com'))
			return res
				.status(401)
				.json({ message: 'Only Gmail or iCloud emails are allowed' })

		// Password validation
		if (password.length < 5 || !/\d/.test(password))
			return res.status(400).json({
				message: 'Password must be at least 5 characters and contain a number.',
			})

		// Generate OTP
		const otp = crypto.randomInt(100000, 999999)
		const otpExpires = new Date(Date.now() + 5 * 60 * 1000)

		const user = new User({
			username,
			password,
			email,
			phone,
			address,
			otp,
			otpExpires,
			isVerified: false,
		})
		await user.save()

		res.status(200).json({
			message:
				'Registration successful. Please check your email for the OTP to verify.',
		})

		// Send OTP
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Email Verification OTP',
			text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
		}
		await transporter.sendMail(mailOptions)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Registration failed.' })
	}
}

exports.verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ message: 'User not found' })
		if (user.otpExpires < Date.now())
			return res.status(400).json({ message: 'OTP expired' })
		if (user.otp !== parseInt(otp, 10))
			return res.status(400).json({ message: 'Invalid OTP' })

		user.isVerified = true
		user.otp = undefined
		user.otpExpires = undefined
		await user.save()
		res
			.status(200)
			.json({ message: 'Email verified successfully. You can now log in.' })
	} catch (error) {
		res.status(500).json({ message: 'OTP verification failed.' })
	}
}

exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(401).json({ message: 'Invalid credentials' })
		if (!user.isVerified)
			return res.status(401).json({ message: 'Please verify your email first' })
		if (!(await user.comparePassword(password)))
			return res.status(401).json({ message: 'Invalid credentials' })

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
		res.json({ user, token })
	} catch (error) {
		res.status(500).json({ message: 'Login failed' })
	}
}
