import db from "../../models/db/DbModel.js";
import jwt from 'jsonwebtoken';

// Get all clients
export const getAllClients = async (req, res) => {
  try {
      const { orgId } = req.query; // Getting orgId from query parameters

      // Modify your SQL query to filter by orgId
      const q = "SELECT * FROM client WHERE org_id = ?";
      const [rows] = await db.query(q, [orgId]);

      res.json({ success: true, items: rows });
  } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};


// Create a new client
// Assuming you're using a 'createClient' function in your controller
export const createClient = async (req, res) => {
  try {
    const { client_name, city, state, org_id,mobile_number,address,email,zip } = req.body;

    const q = "INSERT INTO client (`client_name`, `city`, `state`,`mobile_number`, `org_id`,`address`,`email`,`zip`) VALUES (?,?,?,?,?, ?, ?, ?)";
    await db.query(q, [client_name, city, state,mobile_number, org_id,address,email,zip]);

    res.json({ message: "Client created successfully" });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get a specific client by ID
export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const q = "SELECT client_name, city, state, org_id,mobile_number,address,email,zip FROM client WHERE client_id = ?";
    const [rows] = await db.query(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching client:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_name, city, state, org_id,mobile_number,address,email,zip } = req.body;

    const q = "UPDATE client SET `client_name` = ?, `city` = ?, `state` = ?,`mobile_number` = ?, `org_id` = ?,`address` = ?,`email`=?,`zip`=? WHERE client_id = ?";
    await db.query(q, [client_name, city, state,mobile_number, org_id,address,email,zip, id]);

    res.json({ message: "Client updated successfully" });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM client WHERE client_id = ?";
    await db.query(q, [id]);

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
