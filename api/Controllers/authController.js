import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import db from "../db.js";

export const register = (req, res) => {
  // Registration logic
  const q = "INSERT INTO user (`name`,`email`,`password`) VALUES (?)";

//   // sourcery skip: avoid-using-var
  var myPlaintextPassword = req.body.password;

  const hash = bcrypt.hash(
    myPlaintextPassword.toString(),
    salt,
    (err, hash) => {
      if (err) {
        return res.json({ Error: "Error for hashing password" });
      }
      const values = [req.body.name, req.body.email, hash];
      db.query(q, [values], (err, result) => {
        if (err) {
          return res.json({ Error: "inserting error" });
        }
        return res.json({ Status: "success" });
      });
    }
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const q = "SELECT * FROM user WHERE email = ?";
    const [user] = await db.query(q, [email]);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate and send JWT token
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  // Logout logic
  res.clearCookie("token");
  return res.json({ Status: "success" });
};

export default { register, login, logout };
