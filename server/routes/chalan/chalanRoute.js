import express from 'express';
import { createChalan, createChalanItems, getStockHistory,deleteChalan,updateChalan, getChalanItems } from '../../controllers/chalan/chalanController.js';
import { verifyUser } from '../../controllers/auth/AuthController.js';

const router = express.Router();

// Route to create chalan
router.post('/chalan_history', verifyUser, createChalan);

// Route to create chalan items
router.post('/chalan_items', verifyUser, createChalanItems);

router.get('/chalan_data',verifyUser, getStockHistory);

router.delete('/chalans/:chalanId', deleteChalan);

// Update chalan
router.put('/chalans/:chalanId', updateChalan)

router.get('/chalans/:chalanId/items', getChalanItems);

export default router;
