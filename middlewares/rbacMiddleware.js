const User = require('../models/User');

const checkPermissions = (requiredPermissions) => {
	return async (req, res, next) => {
		try {
			// Retrieve the user ID from the session, token, or request (based on your authentication implementation)
			const userId = req.userId;

			// Find the user in the database
			const user = await User.findById(userId).populate('role');
			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			// Check if the user is disabled
			if (user.disabled) {
				return res.status(403).json({ error: 'Access denied (user is disabled)' });
			}

			// Verify that the role is not disabled
			if (user.role.disabled) {
				return res.status(403).json({ error: 'Access denied (role is disabled)' });
			}

			// Get the user's permissions from their role
			const userPermissions = user.role.permissions;

			// Check if the user has the required permissions
			const hasPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));

			if (!hasPermissions) {
				return res.status(403).json({ error: 'Access denied (insufficient permissions)' });
			}

			// User has the required permissions, proceed to the next middleware or route handler
			next();
		} catch (error) {
			res.status(500).json({ error: 'Server error' });
		}
	};
};

module.exports = checkPermissions;
