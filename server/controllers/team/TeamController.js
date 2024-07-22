import db from "../../models/db/DbModel.js";
import fs from 'fs'
import upload from "../../routes/config/multerConfig.js";

export const getAllTeam = async (req, res) => {
  try {
    const { orgId } = req.query;

    // Ensure orgId is provided and valid
    if (!orgId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    // Fetch teams based on orgId
    const q = "SELECT * FROM team WHERE org_id = ?";
    const [rows] = await db.query(q, [orgId]);

    // Return the teams in the response
    res.json({ success: true, items: rows });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Insert the name into the database
    const q = "INSERT INTO team (name) VALUES (?)";
    await db.query(q, [name]);

    res.json({ message: "Team created successfully" });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const q = "SELECT name FROM inventory WHERE id = ?  "
    const [rows] = await db.query(q, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    const teamData = { ...rows[0] };
    if (teamData.image !== null && Buffer.isBuffer(teamData.image)) {
      try {
        const imageBase64 = teamData.image.toString('base64');
        teamData.image = imageBase64;
      } catch (err) {
        console.error("Error converting image to base64:", err.message);
        
        teamData.image = null;
      }
    }

    delete teamData.image;

    res.json(teamData);
  } catch (error) {
    console.error("Error fetching team:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log("Updating team with ID:", id, "New Name:", name);

    const q = "UPDATE team SET `name`=? WHERE id=?";
    await db.query(q, [name, id]);

    res.json({ message: "Team updated successfully" });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const q = "DELETE FROM team WHERE id = ?";
    await db.query(q, [id]);

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting Team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const updateQuantity = (req, res) => {
//   const { productId, quantity } = req.body;
//   db.query('UPDATE inventory SET quantity = ? WHERE product_id = ?', [quantity, productId], (err, result) => {
//       if (err) {
//           console.error(err);
//           return res.status(500).json({ success: false, error: 'Failed to update quantity' });
//       }
//       return res.json({ success: true });
//   });
// };
