import  db  from "../../models/db/DbModel.js";

export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const q = "SELECT * FROM inventory";
    const [rows] = await db.query(q);
    
    // Return the products in the response
    res.json({ success: true, items: rows });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const q = "INSERT INTO inventory (name, price, quantity) VALUES (?, ?, ?)";
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

    const q = "SELECT * FROM inventory WHERE product_id = ?";
    const [rows] = await db.query(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: rows[0] });
  } catch (error) {
    console.error("Error fetching product:", error.message);

    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    const q = "UPDATE inventory SET name = ?, price = ?, quantity = ? WHERE product_id = ?";
    await db.query(q, [name, price, quantity, id]);
    console.log(id)
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
