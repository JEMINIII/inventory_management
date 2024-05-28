// RoleRoute.js

import express from 'express';
import RoleController from '../../controllers/role/RoleController.js';

const router = express.Router();

// GET all roles
router.get('/', RoleController.getAllRoles);

// GET role by id
router.get('/:id', RoleController.getRoleById);

// POST create a new role
router.post('/', RoleController.createRole);

// PUT update role by id
router.put('/:id', RoleController.updateRole);

// DELETE role by id
router.delete('/:id', RoleController.deleteRole);

export default router