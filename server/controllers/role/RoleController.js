// RoleController.js

import db from "../../models/db/DbModel.js";
import mysql from 'mysql2/promise';

export const getAllRole = async (req, res) => {
  try {
    // Fetch all Team from the database
    const q = "SELECT * FROM roles";
    const [rows] = await db.query(q);

    // Return the Team in the response
    res.json({ success: true, items: rows });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  // Get role by id
//   async getRoleById(req, res) {
//     const { id } = req.params;
//     try {
//       const connection = await mysql.createConnection(db.config);
//       const [role] = await connection.execute('SELECT * FROM roles WHERE id = ?', [id]);
//       connection.end();
//       if (role.length === 0) {
//         return res.status(404).json({ message: 'Role not found' });
//       }
//       res.status(200).json(role[0]);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // Create a new role
//   async createRole(req, res) {
//     const { name, description } = req.body;
//     try {
//       const connection = await mysql.createConnection(db.config);
//       await connection.execute('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
//       connection.end();
//       res.status(201).json({ name, description });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   },

//   // Update role by id
//   async updateRole(req, res) {
//     const { id } = req.params;
//     const { name, description } = req.body;
//     try {
//       const connection = await mysql.createConnection(db.config);
//       const [result] = await connection.execute('UPDATE roles SET name = ?, description = ? WHERE id = ?', [name, description, id]);
//       connection.end();
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: 'Role not found' });
//       }
//       res.status(200).json({ name, description });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   },

//   // Delete role by id
//   async deleteRole(req, res) {
//     const { id } = req.params;
//     try {
//       const connection = await mysql.createConnection(db.config);
//       const [result] = await connection.execute('DELETE FROM roles WHERE id = ?', [id]);
//       connection.end();
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: 'Role not found' });
//       }
//       res.status(204).send();
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
// };


