import  db  from "../../models/db/DbModel.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const q = "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)";
    await db.query(q, [name, price, quantity]);

    res.json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const q = "SELECT * FROM products WHERE id = ?";
    const [rows] = await db.query(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: rows[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    const q = "UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?";
    await db.query(q, [name, price, quantity, id]);

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const q = "DELETE FROM products WHERE id = ?";
    await db.query(q, [id]);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
