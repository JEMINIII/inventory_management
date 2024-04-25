import express from "express";
import { getProduct, createProduct, updateProduct, deleteProduct,getAllProducts } from "../../controllers/product/ProductController.js";

import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getAllProducts);

router.post("/create",upload.single("image"), createProduct);

router.get("/read/:id", getProduct);

router.put("/edit/:id", updateProduct);

router.delete("/products/:id", deleteProduct);

export default router;
