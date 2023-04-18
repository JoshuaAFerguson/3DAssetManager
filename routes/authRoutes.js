const express = require('express');
const { registerUser, loginUser } = require('../models/authController');

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
