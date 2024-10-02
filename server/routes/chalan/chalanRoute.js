import express from 'express';
import { createChalan, createChalanItems, getStockHistory,deleteChalan,updateChalan, getChalanItems,updateChalanItems,deleteChalanItems } from '../../controllers/chalan/chalanController.js';
import { verifyUser } from '../../controllers/auth/AuthController.js';

const router = express.Router();

// Route to create chalan
router.post('/chalan_history', verifyUser, createChalan);

// Route to create chalan items
router.post('/chalan_items', verifyUser, createChalanItems);

router.get('/chalan_data',verifyUser, getStockHistory);

router.delete('/chalans/:chalanId',verifyUser, deleteChalan);

// Update chalan
router.put('/chalans/:chalanId',verifyUser, updateChalan)

router.get('/chalans/:chalanId/items',verifyUser, getChalanItems);
// Route to update a specific chalan item
router.put('/chalans/:chalanId/items/:itemId', verifyUser, updateChalanItems);

// Route to delete a specific chalan item
router.delete('/chalans/:chalanId/items/:itemId', verifyUser, deleteChalanItems);

export default router;
