// Import the database connection
import db from "../../models/db/DbModel.js";

// Controller to get all usersexport const getAllUsers = async (req, res) => {
  export const getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const q = "SELECT * FROM users";
      const [rows] = await db.query(q);
      
      // Assuming you have a way to determine the logged-in user and their role
      // For example, using a user session or JWT token (This example assumes you have user information in req.user)
      const loggedInUser = req.user; // Get the logged-in user from the request
      const userRole = loggedInUser ? loggedInUser.role : null; // Get the user role
  
      // Return the users and the logged-in user's role in the response
      res.json({ success: true, users: rows, name: loggedInUser.name, role: userRole });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };