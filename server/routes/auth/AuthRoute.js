import express from "express";
import { check } from "express-validator";
import { registerUser, loginUser, logoutUser } from "../../controllers/auth/AuthController.js";

const router = express.Router();
router.post("/register", [
  check("email", "Email is invalid or length is not between 10 and 30 characters").isEmail().isLength({ min: 10, max: 30 }),
  check("password", "Password length must be between 8 and 10 characters").isLength({ min: 8, max: 10 }),
], registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

export default router;
