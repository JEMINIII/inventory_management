import express from "express";
import { firstPage,createOrganization,getOrganizationById } from '../../controllers/data/DataController.js'
import { verifyUser } from "../../controllers/auth/AuthController.js";

const router = express.Router();

router.get("/org", firstPage);
router.post("/create_org", createOrganization);
router.get("/org/:id", getOrganizationById);

export default router;
