import db from "../../models/db/DbModel.js";

export const firstPage = async (req, res) => {
  try {
  
    const q = "SELECT * FROM organization " ;
    const [rows] = await db.query(q);
    console.log(rows)
    res.json({ success: true, items: rows });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};