import express from "express";
import { db } from "../db.js";
import {verifyUser} from "./middleware.js"
const router = express.Router();


// Get all products
router.get("/",verifyUser, async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM inventory");
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get product by ID
router.get("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await db.query("SELECT * FROM inventory WHERE id = ?", [id]);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new product
router.post("/create", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    await db.query("INSERT INTO inventory (name, price, description) VALUES (?, ?, ?)", [name, price, description]);
    return res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update a product
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    await db.query("UPDATE inventory SET name = ?, price = ?, description = ? WHERE id = ?", [name, price, description, id]);
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a product
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM inventory WHERE id = ?", [id]);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
