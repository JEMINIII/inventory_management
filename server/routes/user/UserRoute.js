import express from 'express';
import { getAllUsers } from '../../controllers/user/UserController.js'
const router = express.Router();
// Route to get all users
router.get('/users', getAllUsers);

export default router;
