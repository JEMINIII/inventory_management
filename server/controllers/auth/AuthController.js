import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import db from '../../models/db/DbModel.js'
import dotenv from "dotenv";
dotenv.config();

const salt = 10;
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, org_id, inviteCode } = req.body;

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
        return res.status(400).json({ message: "Invalid email or invitation code." });
      }
    }

    // Hash the password
    const saltRounds = 10; // Define your salt rounds
    const hash = await bcrypt.hash(password.toString(), saltRounds);

    // Insert the new user into the database
    const userQuery = "INSERT INTO users (name, email, password, org_id) VALUES (?, ?, ?, ?)";
    const [userInsertResult] = await db.query(userQuery, [name, email, hash, org_id]);

    const firstUserCheckQuery = "SELECT COUNT(*) AS userCount FROM users WHERE org_id = ?";
    const [firstUserCountResult] = await db.query(firstUserCheckQuery, [org_id]);

    // If no teams exist for the organization, create a default team
    const teamCheckQuery = "SELECT * FROM team WHERE org_id = ?";
    const [teamResult] = await db.query(teamCheckQuery, [org_id]);

    // If no teams exist for the organization, create a default team
    if (!teamResult || teamResult.length === 0) {
      const defaultTeamQuery = `
        INSERT INTO team (name, org_id)
        VALUES (?, ?)
      `;
      const [teamInsertResult] = await db.query(defaultTeamQuery, [
        "General Team", // Default team name
        org_id,
      ]);
      console.log("Default team created for org_id:", org_id, "Team ID:", teamInsertResult.insertId);
    }

    // If this is the first user for the organization
    if (firstUserCountResult[0].userCount === 1) {
      // Assign Admin role (Assuming role ID for Admin is known, e.g., 1)
      const adminRoleId = 1; // Change this according to your roles table
      const teamId = teamResult[0]?.id || teamInsertResult.insertId; // Use existing or newly created team ID

      // Insert into team_members table
      const insertTeamMemberQuery = `
        INSERT INTO team_members (user_id, role_id, team_id)
        VALUES (?, ?, ?)
      `;
      await db.query(insertTeamMemberQuery, [userInsertResult.insertId, adminRoleId, teamId]);
    }

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

    const user = {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      org_id: rows[0].org_id
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Login successful", token, user });
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
      next();
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
