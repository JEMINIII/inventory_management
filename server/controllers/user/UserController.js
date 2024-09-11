
import db from "../../models/db/DbModel.js";


  export const getAllUsers = async (req, res) => {
    try {
      
      const q = "SELECT * FROM users";
      const [rows] = await db.query(q);
      

      const loggedInUser = req.user;
      const userRole = loggedInUser ? loggedInUser.role : null; 
  
    
      res.json({ success: true, users: rows, name: loggedInUser.name,orgId:loggedInUser.org_id, role: userRole });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };