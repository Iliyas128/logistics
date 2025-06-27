const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/users', userRoutes)

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB')
		// Start the cleanup scheduler AFTER DB is connected
		startUserCleanupJob()
	})
	.catch(err => console.error('MongoDB connection error:', err))

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})

// --- User cleanup job ---
const User = require('./models/User')

// This function deletes unverified users whose OTP has expired
function cleanupUnverifiedUsers() {
	const now = new Date()
	User.deleteMany({
		isVerified: false,
		otpExpires: { $lt: now },
	})
		.then(result => {
			if (result.deletedCount > 0) {
				console.log(
					`Cleaned up ${result.deletedCount} unverified expired users.`
				)
			}
		})
		.catch(err => {
			console.error('Error cleaning up users:', err)
		})
}

// Start the job every 5 minutes
function startUserCleanupJob() {
	// Run immediately at start
	cleanupUnverifiedUsers()
	// Then every 5 minutes
	setInterval(cleanupUnverifiedUsers, 1 * 60 * 1000)
}
