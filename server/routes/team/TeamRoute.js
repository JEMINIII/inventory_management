import express from "express";
import { getTeam, createTeam, updateTeam, deleteTeam,getAllTeam } from "../../controllers/team/TeamController.js";
import { verifyUser } from "../../controllers/auth/AuthController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/team",verifyUser, getAllTeam);

router.post("/team/create",verifyUser, createTeam);

router.get("/team/read/:id",verifyUser, getTeam);

router.put("/team/edit/:id",verifyUser, updateTeam);

router.delete("/team/delete/:id",verifyUser, deleteTeam);

// router.put('/updateQuantity',updateQuantity);


export default router;
