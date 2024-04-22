// Import the database connection
import db from "../../models/db/DbModel.js";

// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const q = "SELECT * FROM users";
    const [rows] = await db.query(q);

    // Return the users in the response
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
