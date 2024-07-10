// routes/InviteRoute.js

import express from 'express';
import { sendInviteEmail } from '../../controllers/invite/InviteController.js';

const router = express.Router();

router.post('/invite', sendInviteEmail);

export default router;
