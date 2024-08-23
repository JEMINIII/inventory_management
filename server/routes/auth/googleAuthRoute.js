import express from 'express';
import { googleLogin, googleLoginCallback } from '../../controllers/auth/googleAuthController.js';

const router = express.Router();

// Route for Google login
router.get('/auth/google', googleLogin);

// Route for Google login callback
router.get('/auth/google/callback', googleLoginCallback);

export default router;
