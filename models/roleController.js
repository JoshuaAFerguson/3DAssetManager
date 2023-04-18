const Role = require('./Role');
const User = require('./User');

const createRole = async (req, res) => {
	const { name, permissions } = req.body;

	try {
		const newRole = new Role({ name, permissions });
		await newRole.save();
		res.status(201).json({ message: 'Role created successfully', role: newRole });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const listRoles = async (req, res) => {
	try {
		const roles = await Role.find();
		res.status(200).json({ roles });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const updateRole = async (req, res) => {
	const { roleId, name, permissions } = req.body;

	try {
		const updatedRole = await Role.findByIdAndUpdate(roleId, { name, permissions }, { new: true });
		res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const assignRoleToUser = async (req, res) => {
	const { roleId, userId } = req.body;

	try {
		const updatedUser = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true });
		res.status(200).json({ message: 'Role assigned to user successfully', user: updatedUser });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const updateRoleStatus = async (req, res) => {
	const { roleId, disabled } = req.body;

	try {
		const updatedRole = await Role.findByIdAndUpdate(roleId, { disabled }, { new: true });
		res.status(200).json({ message: 'Role status updated successfully', role: updatedRole });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = {
	createRole,
	listRoles,
	updateRole,
	assignRoleToUser,
	updateRoleStatus,
};
