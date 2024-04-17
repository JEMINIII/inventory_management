import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { db } from "../db.js";
import { verifyUser } from "../index.js";
const router = express.Router();

router.post(
  "/register",
  [
    check(
      "email",
      "Email is invalid or length is not between 10 and 30 characters"
    )
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check(
      "password",
      "Password length must be between 8 and 10 characters"
    ).isLength({ min: 8, max: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if email already exists
      const existingUser = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Insert new user into the database
      await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    // Find user by email
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.json({ Error: "No email exists" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token)
   
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
