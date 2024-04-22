import express from "express";
import { getProduct, createProduct, updateProduct, deleteProduct,getAllProducts } from "../../controllers/product/ProductController.js";

const router = express.Router();

router.get("/", getAllProducts);

router.post("/products", createProduct);

router.get("/read/:id", getProduct);

router.put("/edit/:id", updateProduct);

router.delete("/products/:id", deleteProduct);

export default router;
