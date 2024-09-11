import express from "express";
import { firstPage } from '../../controllers/data/DataController.js'
import { verifyUser } from "../../controllers/auth/AuthController.js";

const router = express.Router();

router.get("/org",verifyUser, firstPage);

export default router;
