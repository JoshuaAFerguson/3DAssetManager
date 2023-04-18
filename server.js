const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const File = require('./models/File');
const Category = require('./models/Category');
const initDatabase = require('./dbInit');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');

// Retrieve MongoDB connection details from environment variables
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const database = process.env.MONGODB_DATABASE;

// Check that MongoDB connection details have been set
if (!host || !port || !username || !password || !database) {
	console.log('Missing MongoDB connection details');
	process.exit(1);
}

// Check that the default MongoDB admin password has been changed
if (username === 'admin' && password === 'password') {
	console.log('Please change the default MongoDB admin password');
	process.exit(1);
}

// Construct the MongoDB connection string
//if no username and password, then no @
if (username === '' && password === '') {
	const connectionString = `mongodb://${host}:${port}/${database}`;
} else {
	const connectionString = `mongodb://${username}:${password}@${host}:${port}/${database}`;
}

// Connect to the MongoDB database
mongoose
	.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB');
		// Initialize the database (create admin user if needed)
		initDatabase();
	})
	.catch((err) => console.log('Failed to connect to MongoDB:', err));

// Setup middleware

// Use the authRoutes middleware
app.use('/auth', authRoutes);

// Use the roleRoutes middleware
app.use('/roles', roleRoutes);

// Parse JSON request bodies
app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Define Routes

// Define a route for the home page
app.get('/', (req, res) => {
	res.render('index');
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
