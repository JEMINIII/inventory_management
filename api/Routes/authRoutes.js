// authRoute.js
import express from 'express';
import { check, validationResult } from 'express-validator';
import { register, login, logout } from '../Controllers/authController.js'

const router = express.Router();

// Validation middleware for registering a user
const validateRegisterUser = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 8, max: 10 }).withMessage('Password length must be between 8 and 10 characters'),
];

// Route for registering a user
router.post('/register', validateRegisterUser, register);

// Route for logging in a user
router.post('/login', login);

// Route for logging out a user
router.get('/logout', logout);

export default router;
