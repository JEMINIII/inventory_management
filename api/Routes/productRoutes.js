// productRoute.js
import express from 'express';
import productController from '../Controllers/productController.js';
import verifyUser from "../middlewares/authmiddleware.js"

const router = express.Router();

router.get("/", verifyUser, productController.getAllProducts);
router.post("/", verifyUser, productController.createProduct);
router.get("/:product_id", verifyUser, productController.getProductById);
router.put("/:product_id", verifyUser, productController.editProduct);
router.delete("/:product_id", verifyUser, productController.deleteProduct);

export default router;
