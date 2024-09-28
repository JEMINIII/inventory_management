
import db from "../../models/db/DbModel.js";
import { v4 as uuidv4 } from 'uuid';

export const createChalan = async (req, res) => {
  try {
    // Destructure inputs from the request body
    const { team_id, client_id } = req.body;
    if (!client_id) {
      return res.status(400).json({ success: false, message: 'Client ID is required' });
    }

    // Generate a unique chalan ID
    const chalanId = uuidv4();
    console.log(chalanId); // Log the generated chalan ID

    // Prepare the chalan history entry
      const chalanHistoryEntry = {
        id: chalanId,
        client_id: client_id,
        team_id: team_id,
        date: new Date() 
      };

    await db.query(
      'INSERT INTO chalan_history (id, client_id, team_id, date) VALUES (?, ?, ?, NOW())',
      [chalanHistoryEntry.id, chalanHistoryEntry.client_id, chalanHistoryEntry.team_id] // Use destructured values
    );

    res.status(200).json({ success: true, chalanId });
  } catch (error) {
    console.error("Error creating chalan:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const createChalanItems = async (req, res) => {
  try {
    console.log(req.body); 
    const { chalan_id, product_id, quantity } = req.body; 
      await db.query(
        'INSERT INTO chalan_items (chalan_id, product_id, quantity) VALUES (?, ?, ?)',
        [chalan_id, product_id, quantity]
      );

   
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error creating chalan items:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStockHistory = async (req, res) => {
  try {
    // Retrieve orgId from JWT payload (req.user) or from query params
    const { orgId } =  req.query;

    // Ensure orgId is provided
    if (!orgId) {
      return res.status(400).json({ success: false, error: "Organization ID is required." });
    }

    // SQL query to fetch chalan history for the specific organization
    const [results] = await db.query(`
      SELECT chalan_history.*
      FROM chalan_history
      JOIN client ON chalan_history.client_id = client.client_id
      WHERE client.org_id = ?
    `, [orgId]);
    // Send response with results
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    // Catch and handle errors
    console.error("Error fetching stock history:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};



export const deleteChalan = async (req, res) => {
  try {
    const { chalanId } = req.params;

    // Delete related chalan items first
    await db.query('DELETE FROM chalan_items WHERE chalan_id = ?', [chalanId]);

    // Then delete the chalan from chalan_history
    await db.query('DELETE FROM chalan_history WHERE id = ?', [chalanId]);

    res.status(200).json({ success: true, message: 'Chalan deleted successfully' });
  } catch (error) {
    console.error("Error deleting chalan:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};



export const updateChalan = async (req, res) => {
  try {
    const { chalanId } = req.params;
    const { client_id, team_id, items } = req.body;

    // Update the chalan information in the chalan_history table
    await db.query(
      'UPDATE chalan_history SET client_id = ?, team_id = ? WHERE id = ?',
      [client_id, team_id, chalanId]
    );

    // Optionally update items (if provided in the request)
    if (items && items.length > 0) {
      for (const item of items) {
        const { product_id, quantity } = item;

        // Check if item exists
        const [existingItem] = await db.query(
          'SELECT * FROM chalan_items WHERE chalan_id = ? AND product_id = ?',
          [chalanId, product_id]
        );

        if (existingItem) {
          // Update existing item
          await db.query(
            'UPDATE chalan_items SET quantity = ? WHERE chalan_id = ? AND product_id = ?',
            [quantity, chalanId, product_id]
          );
        } else {
          // Insert new item if it doesn't exist
          await db.query(
            'INSERT INTO chalan_items (chalan_id, product_id, quantity) VALUES (?, ?, ?)',
            [chalanId, product_id, quantity]
          );
        }
      }
    }

    res.status(200).json({ success: true, message: 'Chalan updated successfully' });
  } catch (error) {
    console.error("Error updating chalan:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getChalanItems = async (req, res) => {
  try {
    const { chalanId } = req.params;

    // Query to fetch items related to a specific Chalan
                                    const items = await db.query(
                                      'SELECT ci.product_id, ci.quantity, p.product_name FROM chalan_items ci JOIN inventory p ON ci.product_id = p.product_id WHERE ci.chalan_id = ?',
                                      [chalanId]
                                    );

    if (items.length > 0) {
      res.status(200).json({ success: true, items });
    } else {
      res.status(404).json({ success: false, message: 'No items found for this chalan.' });
    }
  } catch (error) {
    console.error("Error fetching chalan items:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};