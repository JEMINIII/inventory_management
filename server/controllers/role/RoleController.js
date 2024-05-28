// RoleController.js

import db from '../../models/db/DbModel';
import mysql from 'mysql2/promise';

const RoleController = {
  // Get all roles
  async getAllRoles(req, res) {
    try {
      const connection = await mysql.createConnection(db.config);
      const [roles] = await connection.execute('SELECT * FROM roles');
      connection.end();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get role by id
  async getRoleById(req, res) {
    const { id } = req.params;
    try {
      const connection = await mysql.createConnection(db.config);
      const [role] = await connection.execute('SELECT * FROM roles WHERE id = ?', [id]);
      connection.end();
      if (role.length === 0) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.status(200).json(role[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new role
  async createRole(req, res) {
    const { name, description } = req.body;
    try {
      const connection = await mysql.createConnection(db.config);
      await connection.execute('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
      connection.end();
      res.status(201).json({ name, description });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update role by id
  async updateRole(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const connection = await mysql.createConnection(db.config);
      const [result] = await connection.execute('UPDATE roles SET name = ?, description = ? WHERE id = ?', [name, description, id]);
      connection.end();
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.status(200).json({ name, description });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete role by id
  async deleteRole(req, res) {
    const { id } = req.params;
    try {
      const connection = await mysql.createConnection(db.config);
      const [result] = await connection.execute('DELETE FROM roles WHERE id = ?', [id]);
      connection.end();
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = RoleController;
