import express from "express";
import { firstPage,createOrganization } from '../../controllers/data/DataController.js'
import { verifyUser } from "../../controllers/auth/AuthController.js";

const router = express.Router();

router.get("/org", firstPage);
router.post("/create_org", createOrganization);

export default router;
