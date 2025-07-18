const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	address: { type: String },
	isVerified: { type: Boolean, default: false },
	otp: { type: Number },
	otpExpires: { type: Date }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	this.password = await bcrypt.hash(this.password, 10)
	next()
})

userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
