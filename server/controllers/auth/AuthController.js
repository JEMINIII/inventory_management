import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import db from '../../models/db/DbModel.js';

dotenv.config();

const salt = 10;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    console.log("Received data:", req.body); // Log received data

    // Check if the email is already registered
    const emailQuery = "SELECT * FROM users WHERE email = ?";
    const [emailResult] = await db.query(emailQuery, [email]);

    if (emailResult && emailResult.length > 0) {
      console.log("Email already registered"); // Log email already registered
      return res.status(400).json({ message: "Email is already registered." });
    }

    // If inviteCode is provided, validate it
    if (inviteCode) {
      const inviteQuery = "SELECT * FROM invitations WHERE email = ? AND code = ?";
      const [inviteResult] = await db.query(inviteQuery, [email, inviteCode]);

      if (!inviteResult || inviteResult.length === 0) {
        console.log("Invite validation failed"); // Log validation failure
        return res
          .status(400)
          .json({ message: "Invalid email or invitation code." });
      }
    }

    // Hash the password
    const hash = await bcrypt.hash(password.toString(), salt);

    // Insert the new user into the database
    const userQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await db.query(userQuery, [name, email, hash]);

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const q = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(q, [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const match = await bcrypt.compare(
      password.toString(),
      rows[0].password.toString()
    );
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: rows[0].id, email: rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true,sameSite: 'none', secure: true });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const logoutUser = async (req, res) => {
//   try {
//     res.clearCookie("token");
//     res.json({ message: "Logout successful" });
//   } catch (error) {
//     console.error("Error logging out:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");
    // Send a success response
    res.json({ message: "Logout successful" });
  } catch (error) {
    // Handle any errors
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      req.user = decoded; // Ensure decoded contains necessary user data
      // console.log('Decoded token:', decoded); // Log decoded token for debugging
      next();
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
