const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
	const secret = process.env.JWT_SECRET;
	const token = jwt.sign({ userId }, secret, { expiresIn: '1h' }); // 1 hour expiration
	return token;
};

const verifyToken = (token) => {
	const secret = process.env.JWT_SECRET;
	try {
		const decoded = jwt.verify(token, secret);
		return decoded;
	} catch (error) {
		return null;
	}
};

const authenticateJWT = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer TOKEN"
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	// Set the userId in the request object for further processing
	req.userId = decoded.userId;
	next();
};

module.exports = {
	generateToken,
	verifyToken,
	authenticateJWT,
};
