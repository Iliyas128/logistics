const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		// restrict to only gmail if you want
		validate: {
			validator: v => /\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(v),
			message: props => `${props.value} is not a valid Gmail!`,
		},
	},
	phone: { type: String, required: true },
	address: { type: String },
	otp: { type: Number },
	otpExpires: { type: Date },
	isVerified: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
})

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	this.password = await bcrypt.hash(this.password, 10)
	next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
