import express from "express";
import {
  getAllClients,
  createClient,
  getClient,
  updateClient,
  deleteClient,
} from "../../controllers/clients/clientsController.js"
import { verifyUser } from "../../controllers/auth/AuthController.js"; // Ensure this is the correct path

const router = express.Router();

// Get all clients
router.get("/clients", verifyUser, getAllClients);

// Create a new client
router.post("/clients/create", verifyUser, createClient);

// Get a specific client by ID
router.get("/clients/read/:id", verifyUser, getClient);

// Update a client
router.put("/clients/edit/:id", verifyUser, updateClient);

// Delete a client
router.delete("/clients/delete/:id", verifyUser, deleteClient);

export default router;
