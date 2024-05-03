import db from "../../models/db/DbModel.js";

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
    // Access the fields from FormData
    const { product_name, category, price, quantity, total_amount, images } = req.body;

    const q = "INSERT INTO inventory (`product_name`,`category`,`price`,`quantity`,`total_amount`, `images`) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(q, [product_name, category, price, quantity, total_amount, images]);

    res.json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const q = "SELECT product_name, category, price, quantity, total_amount, CONVERT(images USING utf8) AS image FROM inventory WHERE product_id = ?";
    const [rows] = await db.query(q, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productData = { ...rows[0] };
    if (productData.image !== null) {
      const imageBase64 = productData.image.toString('base64');
      productData.image = imageBase64;
    }

    delete productData.image_base64;

    res.json(productData);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, category, price, quantity, total_amount } = req.body;
    console.log(product_name);

    const q =
      "UPDATE inventory SET `product_name`=?, `category`=?, `price`=?, `quantity`=?, `total_amount`=? WHERE product_id=?";
    await db.query(q, [
      product_name,
      category,
      price,
      quantity,
      total_amount,
      id,
    ]);

    
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const q = "DELETE FROM inventory WHERE id = ?";
    await db.query(q, [id]);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuantity = (req, res) => {
  const { productId, quantity } = req.body;
  db.query('UPDATE inventory SET quantity = ? WHERE product_id = ?', [quantity, productId], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Failed to update quantity' });
      }
      return res.json({ success: true });
  });
};
