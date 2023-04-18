const express = require('express');
const { createRole, listRoles, updateRole, assignRoleToUser, updateRoleStatus } = require('../models/roleController');
const { authenticateJWT, checkPermissions } = require('../middlewares');

const router = express.Router();

// Define routes and use checkPermissions middleware where needed
router.post('/create', authenticateJWT, checkPermissions(['create-role']), createRole);
router.get('/list', authenticateJWT, listRoles);
router.put('/update', authenticateJWT, checkPermissions(['update-role']), updateRole);
router.put('/assign', authenticateJWT, checkPermissions(['assign-role']), assignRoleToUser);
router.put('/update-status', authenticateJWT, checkPermissions(['update-role']), updateRoleStatus);

module.exports = router;
