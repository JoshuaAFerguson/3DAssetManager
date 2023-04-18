const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	createdAt: { type: Date, default: Date.now }, // New field for user creation datetime
	disabled: { type: Boolean, default: false }, // New field for user disabled status
	role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
});

// Hash the password before saving the user document
UserSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
	next();
});

// Compare plaintext password with hashed password
UserSchema.methods.comparePassword = async function (plaintextPassword) {
	return await bcrypt.compare(plaintextPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
