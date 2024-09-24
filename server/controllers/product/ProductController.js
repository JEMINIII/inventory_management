import db from "../../models/db/DbModel.js";
import fs from 'fs';
import upload from "../../routes/config/multerConfig.js";
import moment from 'moment'; 
import  {generateInvoice}  from "./pdfGenerator.js";
import jwt from 'jsonwebtoken';

export const getAllProducts = async (req, res) => {
  try {
    const { team_id } = req.query;
    // console.log(req.query)
    const q = team_id ? "SELECT * FROM inventory WHERE team_id = ?" : "SELECT * FROM inventory";
    const [rows] = await db.query(q, [team_id]);

    res.json({ success: true, items: rows });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const createProduct = async (req, res) => {
  try {
    const { product_name, category, price, quantity, total_amount, team_id, user_id } = req.body;
    const img = req.file.filename;

    // Check if team_id is provided and is a valid integer, otherwise set it to null
    const teamIdValue = team_id ? parseInt(team_id, 10) : null;

    const q = "INSERT INTO inventory (`product_name`, `category`, `price`, `quantity`, `total_amount`, `img`, `team_id`) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
    
    await db.query(q, [product_name, category, price, quantity, total_amount, img, teamIdValue, user_id]);

    res.json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const q = "SELECT product_name, category, price, quantity, total_amount, img FROM inventory WHERE product_id = ?";
    const [rows] = await db.query(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productData = { ...rows[0] };
    if (productData.image !== null && Buffer.isBuffer(productData.image)) {
      try {
        const imageBase64 = productData.image.toString('base64');
        productData.image = imageBase64;
      } catch (err) {
        console.error("Error converting image to base64:", err.message);
        productData.image = null;
      }
    }

    delete productData.image;

    res.json(productData);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, category, price, quantity, total_amount, team_id } = req.body;
    const q = "UPDATE inventory SET `product_name`=?, `category`=?, `price`=?, `quantity`=?, `total_amount`=?, `team_id`=?, `updated_date`=CURRENT_TIMESTAMP WHERE product_id=?";
    await db.query(q, [product_name, category, price, quantity, total_amount, team_id, id]);

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM inventory WHERE product_id = ?";
    await db.query(q, [id]);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuantity = async (req, res) => {
  const { productId, quantity, action, userName } = req.body;

  // Start a transaction
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Update inventory
    const [result] = await connection.query(
      'UPDATE inventory SET quantity = ? WHERE product_id = ?',
      [quantity, productId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Failed to update quantity or product not found.');
    }

    // Insert a record into stock_history
    const [historyResult] = await connection.query(
      'INSERT INTO stock_history (product_id, product_name, quantity, team_id, user_name, action, date) ' +
      'SELECT product_id, product_name, ?, team_id, ?, ?, NOW() FROM inventory WHERE product_id = ?',
      [quantity, userName, action, productId]
    );

    // Commit the transaction
    await connection.commit();

    // Respond with success
    return res.json({ success: true });
  } catch (err) {
    // Rollback transaction in case of error
    await connection.rollback();
    console.error('Error updating quantity:', err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

export const getStockHistory = async (req, res) => {
  const { teamId } = req.query;

  try {
    const q = "SELECT * FROM stock_history WHERE team_id = ? ORDER BY date DESC";
    const [rows] = await db.query(q, [teamId]);

    res.json({ success: true, history: rows });
  } catch (error) {
    console.error("Error fetching stock history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const createSale = async (req, res) => {
  try {
    const { items, teamId } = req.body; // Expecting `items` and `teamId`

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    // Get the user_id from the JWT token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id; // Ensure you extract user_id from decoded token

    // Generate a new sale ID
    const [saleResult] = await db.query(
      'INSERT INTO sales (team_id, user_id) VALUES (?, ?)',
      [teamId, userId]
    );
    const saleId = saleResult.insertId;

    for (const item of items) {
      const { product_id, quantity } = item;

      // Fetch product details and check stock
      const [rows] = await db.query(
        'SELECT * FROM inventory WHERE product_id = ? AND team_id = ?',
        [product_id, teamId]
      );

      if (rows.length === 0) {
        return res.status(400).json({ success: false, message: `Product ${product_id} not found` });
      }

      const product = rows[0];

      if (product.quantity < quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product ${product_id}` });
      }

      const totalAmount = product.price * quantity;

      // Insert into sale_items
      await db.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, total_amount) VALUES (?, ?, ?, ?)',
        [saleId, product_id, quantity, totalAmount]
      );

      // Update inventory
      await db.query(
        'UPDATE inventory SET quantity = quantity - ?, total_amount = total_amount - ?, updated_date = ? WHERE product_id = ? AND team_id = ?',
        [quantity, totalAmount, moment().format('YYYY-MM-DD HH:mm:ss'), product_id, teamId]
      );
    }

    res.status(200).json({ success: true, saleId });
  } catch (error) {
    console.error("Error processing sale:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};







export const getSales = async (req, res) => {
  try {
    const { team_id } = req.query;

    const sales = await db.query(
      'SELECT * FROM sales WHERE team_id = ? ORDER BY sale_date DESC',
      [team_id]
    );

    res.status(200).json({ success: true, sales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInventory = async (req, res) => {
  try {
    const { team_id } = req.query;

    const [inventory] = await db.query(
      'SELECT * FROM inventory WHERE team_id = ? ORDER BY product_name ASC',
      [team_id]
    );

    res.status(200).json({ success: true, inventory });
  } catch (error) {
    console.error("Error fetching inventory:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// salesController.js

export const getSalesAnalysis = async (req, res) => {
  const { period } = req.query;  // Assuming you're passing the period via query parameters

  try {
    // Fetch sales data filtered by period
    let query = `
      SELECT 
        s.sale_id,
        s.sale_date,
        SUM(si.total_amount) AS total_amount,
        SUM(si.quantity) AS quantity,
        GROUP_CONCAT(p.product_name) AS product_name
      FROM sales s
      JOIN sale_items si ON s.sale_id = si.sale_id
      JOIN inventory p ON si.product_id = p.product_id
      WHERE 1 = 1
    `;

    // Apply period filter conditionally
    if (period === 'yearly') {
      query += ` AND YEAR(s.sale_date) = YEAR(CURDATE())`;
    } else if (period === 'monthly') {
      query += ` AND MONTH(s.sale_date) = MONTH(CURDATE())`;
    } else if (period === 'daily') {
      query += ` AND DATE(s.sale_date) = CURDATE()`;
    }

    query += `
      GROUP BY s.sale_id
    `;

    const [sales] = await db.query(query);

    if (sales.length === 0) {
      return res.status(404).json({ success: false, message: 'No sales data found.' });
    }

    // Aggregate data for analysis (e.g., total sales, total revenue)
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total_amount, 0);
    const totalProductsSold = sales.reduce((acc, sale) => acc + parseFloat(sale.quantity), 0);


    res.status(200).json({
      totalSales,
      totalRevenue,
      totalProductsSold,
      sales,
    });
  } catch (error) {
    console.error("Error fetching sales analysis:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};



