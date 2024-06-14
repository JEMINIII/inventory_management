import db from "../../models/db/DbModel";

// Function to add a team member
export const addTeamMember = (req, res) => {
  const { user_id, role_id, team_id } = req.body;

  const sql = 'INSERT INTO team_members (user_id, role_id, team_id) VALUES (?, ?, ?)';

  db.query(sql, [user_id, role_id, team_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add team member' });
    } else {
      res.status(201).json({ success: 'Team member added successfully', memberId: result.insertId });
    }
  });
};

// Function to fetch team members
export const getTeamMembers = (req, res) => {
  const { team_id } = req.params;

  const sql = `
    SELECT tm.id, tm.team_id, u.name as user_name, r.name as role_name
    FROM team_members tm
    JOIN users u ON tm.user_id = u.id
    JOIN roles r ON tm.role_id = r.id
    WHERE tm.team_id = ?
  `;

  db.query(sql, [team_id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch team members' });
    } else {
      res.status(200).json({ success: true, teamMembers: results });
    }
  });
};
