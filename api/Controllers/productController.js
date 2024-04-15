// productController.js
import db from "../db.js";
const getAllProducts = async (req, res) => {
    try {
      const q = "SELECT product_id, product_name, price, quantity, total_amount FROM inventory";
      const result = await db.query(q);
  
      return res.status(200).json({ Status: "success", inventory: result });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ Message: "Error inside server" });
    }
  };

const createProduct = async (req, res) => {
  try {
    const q =
      "INSERT INTO inventory (`product_name`,`category`,`price`,`quantity`,`total_amount`, `images`) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.product_name,
      req.body.category,
      req.body.price,
      req.body.quantity,
      req.body.total_amount,
      req.file.filename, // Assuming req.file.filename contains the uploaded image filename
    ];

    const result = await db.query(q, values);
    console.log(result);
    return res.json(result);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const q = "SELECT * FROM inventory WHERE product_id = ?";
    const id = req.params.product_id;

    const result = await db.query(q, [id]);
    if (result.length > 0) {
      const { images, ...productData } = result[0];
      const blobUrl = `http://localhost:8082/images/${images}`;
      const productWithBlobUrl = { ...productData, image: blobUrl };
      return res.json(productWithBlobUrl);
    } else {
      return res.status(404).json({ Message: "Product not found" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ Message: "Error inside server" });
  }
};

const editProduct = async (req, res) => {
  try {
    const q =
      "UPDATE inventory SET `product_name`=?, `category`=?, `price`=?, `quantity`=?, `total_amount`=? WHERE product_id=?";
    const { product_id } = req.params;

    const result = await db.query(q, [
      req.body.product_name,
      req.body.category,
      req.body.price,
      req.body.quantity,
      req.body.total_amount,
      product_id,
    ]);

    return res.json(result);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ Message: "Error inside server" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const q = "DELETE FROM inventory WHERE product_id = ?";
    const { id } = req.params;
    const result = await db.query(q, [id]);
    return res.json(result);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ Message: "Error inside server" });
  }
};

export default { getAllProducts, createProduct, getProductById, editProduct, deleteProduct };