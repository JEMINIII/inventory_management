import express from 'express';
import { addTeamMember, getTeamMembers } from './path/to/your/controller';

const router = express.Router();

// Route to add a team member
router.post('/api/team_members', addTeamMember);

// Route to get team members by team ID
router.get('/api/team_members/:team_id', getTeamMembers);

export default router;
