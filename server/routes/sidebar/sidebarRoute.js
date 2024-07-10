
import express from 'express';
const router = express.Router();
import {getSidebarMenuItems} from '../../controllers/sidebar/SidebarController.js'
import { verifyUser } from '../../controllers/auth/AuthController.js';

router.get('/sidebar',verifyUser, getSidebarMenuItems);


export default router
