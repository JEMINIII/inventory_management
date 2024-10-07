import express from "express";
import { getProduct, createProduct, updateProduct, deleteProduct,getAllProducts, updateQuantity,createSale,getSales ,getInventory,getSalesAnalysis,getStockHistory} from "../../controllers/product/ProductController.js";
import { verifyUser } from "../../controllers/auth/AuthController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/",verifyUser, getAllProducts);

router.post("/create",upload.single("image"), createProduct);

router.get("/read/:id",verifyUser, getProduct);

router.put("/edit/:id",verifyUser, updateProduct);

router.delete("/delete/:id",verifyUser, deleteProduct);

router.put('/updateQuantity',verifyUser,updateQuantity);

router.post('/sales',verifyUser, createSale);

router.get('/sales',verifyUser, getSales);

router.get('/inventory',verifyUser, getInventory);

router.get('/sales/analysis',verifyUser, getSalesAnalysis);

router.get('/stock-history',verifyUser, getStockHistory);


export default router;
