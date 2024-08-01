import db from "../../models/db/DbModel.js";
import jwt from 'jsonwebtoken';

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
