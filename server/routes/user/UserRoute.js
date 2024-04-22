import express from 'express';
import { getAllUsers } from '../../controllers/user/UserController.js'
const router = express.Router();
// Route to get all users
router.get('/users', getAllUsers);

// Other routes can be defined similarly for creating, updating, deleting users, etc.
export default router;
