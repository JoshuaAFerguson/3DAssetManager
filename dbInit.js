const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const initDatabase = async () => {
	// Define the roles and their permissions
	const rolesData = [
		{ name: 'Administrators', permissions: ['admin'] },
		{ name: 'Moderators', permissions: ['moderate'] },
		{ name: 'Users', permissions: ['user'] },
		{ name: 'Public', permissions: [] },
	];

	// Check for the existence of roles and create them if needed
	for (const roleData of rolesData) {
		const existingRole = await Role.findOne({ name: roleData.name });
		if (!existingRole) {
			const newRole = new Role(roleData);
			await newRole.save();
			console.log(`Role "${roleData.name}" created.`);
		}
	}
	// Find the Administrators role
	const adminRole = await Role.findOne({ name: 'Administrators' });

	// Check if the admin user already exists
	const adminUsername = process.env.ADMIN_USERNAME || 'admin';
	const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

	const adminUser = await User.findOne({ username: adminUsername });
	if (!adminUser) {
		// Hash the default admin password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(adminPassword, salt);

		// Create the admin user with the Administrators role
		const newAdminUser = new User({
			username: adminUsername,
			password: hashedPassword,
			email: `${adminUsername}@example.com`,
			role: adminRole, // Assign the Administrators role
		});

		await newAdminUser.save();
		console.log('Admin user created with default credentials.');
	} else {
		console.log('Admin user already exists.');
	}
};

module.exports = initDatabase;
