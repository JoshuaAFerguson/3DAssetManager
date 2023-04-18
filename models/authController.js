const User = require('./User');
const bcrypt = require('bcrypt');
const { generateToken } = require('./jwtAuth');

const registerUser = async (req, res) => {
	const { username, password, email } = req.body;

	try {
		// Check if the user already exists
		const userExists = await User.findOne({ username });
		if (userExists) {
			return res.status(400).json({ error: 'Username already exists' });
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user
		const newUser = new User({
			username,
			password: hashedPassword,
			email,
		});

		// Save the user to the database
		await newUser.save();

		res.status(201).json({ message: 'User registered successfully', user: newUser });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const loginUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		// Find the user by username
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ error: 'Invalid username or password' });
		}

		// Compare the provided password with the stored hashed password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid username or password' });
		}

		// User is authenticated; generate a JWT token
		const token = generateToken(user._id);

		// User is authenticated; create a session or token as needed
		// For simplicity, we return a successful login message
		res.status(200).json({ message: 'User logged in successfully', user, token });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = {
	registerUser,
	loginUser,
};
