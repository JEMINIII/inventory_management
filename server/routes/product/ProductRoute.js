import express from "express";
import { getProduct, createProduct, updateProduct, deleteProduct,getAllProducts, updateQuantity,createSale,getSales ,getInventory,getSalesAnalysis} from "../../controllers/product/ProductController.js";
import { verifyUser } from "../../controllers/auth/AuthController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/",verifyUser, getAllProducts);

router.post("/create",upload.single("image"), createProduct);

router.get("/read/:id",verifyUser, getProduct);

router.put("/edit/:id",verifyUser, updateProduct);

router.delete("/delete/:id",verifyUser, deleteProduct);

router.put('/updateQuantity',updateQuantity);

router.post('/sales', createSale);

router.get('/sales', getSales);

router.get('/inventory', getInventory);

router.get('/sales/analysis', getSalesAnalysis);


export default router;
