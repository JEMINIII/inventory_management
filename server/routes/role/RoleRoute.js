// RoleRoute.js

import express from 'express';
import {getAllRole} from '../../controllers/role/RoleController.js'
import { verifyUser } from "../../controllers/auth/AuthController.js";
const router = express.Router();

// GET all roles
router.get('/',verifyUser,getAllRole);

// // GET role by id
// router.get('/roles/:id', RoleController.getRoleById);

// // POST create a new role
// router.post('/', RoleController.createRole);

// // PUT update role by id
// router.put('/:id', RoleController.updateRole);

// // DELETE role by id
// router.delete('/:id', RoleController.deleteRole);

export default router