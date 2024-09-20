import db from "../../models/db/DbModel.js";
import jwt from 'jsonwebtoken';

export const createOrganization = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: "Organization name is required" });
  }

  try {
    const query = "INSERT INTO organization (name, description) VALUES (?, ?)";
    const result = await db.query(query, [name, description]);

    const newOrgId = result.insertId;
    const orgQuery = "SELECT * FROM organization WHERE id = ?";
    const [newOrg] = await db.query(orgQuery, [newOrgId]);

    res.status(201).json({ success: true, organization: newOrg });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const firstPage = async (req, res) => {
  try {
    const q = "SELECT * FROM organization";
    const [rows] = await db.query(q);

    const token = jwt.sign(
      { id: rows },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.json({ success: true, items: rows });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
