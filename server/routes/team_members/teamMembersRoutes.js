import express from 'express';
import { addTeamMember, getTeamMembers } from '../../controllers/team_members/TeamMembersController.js';
import { verifyUser } from "../../controllers/auth/AuthController.js";
const router = express.Router();

// Route to add a team member
router.post('/team_members',verifyUser, addTeamMember);

// Route to get team members by team ID
router.get('/team_members/:team_id',verifyUser, getTeamMembers);

export default router;

