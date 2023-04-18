const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	permissions: [String], // Array of permission names (e.g., ['create-posts', 'edit-posts'])
	disabled: { type: Boolean, default: false },
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
