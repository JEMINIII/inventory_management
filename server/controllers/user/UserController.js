// Import the database connection
import db from "../../models/db/DbModel.js";

// Controller to get all usersexport const getAllUsers = async (req, res) => {
  export const getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const q = "SELECT * FROM users";
      const [rows] = await db.query(q);
      
      const loggedInUser = req.user; // Get the logged-in user from the request
      const userRole = loggedInUser ? loggedInUser.role : null; // Get the user role
  
      // Return the users and the logged-in user's role in the response
      res.json({ success: true, users: rows, name: loggedInUser.name,orgId:loggedInUser.org_id, role: userRole });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };