import express from 'express';
import { getAllUsers } from '../../controllers/user/UserController.js'
import { verifyUser } from '../../controllers/auth/AuthController.js';
const router = express.Router();
// Route to get all users
router.get('/users',verifyUser, getAllUsers);

export default router;
