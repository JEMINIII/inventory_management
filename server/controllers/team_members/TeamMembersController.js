import db from "../../models/db/DbModel.js";

export const addTeamMember = async (req, res) => {
  const { user_id, role_id, team_id } = req.body;

  if (!user_id || !role_id || !team_id) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  try {
    // Insert the new team member
    const result = await db.query(
      'INSERT INTO team_members (user_id, role_id, team_id) VALUES (?, ?, ?)',
      [user_id, role_id, team_id]
    );
    
    res.status(201).send({ message: 'Member added successfully', member: result });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Duplicate entry error handling
      return res.status(400).send({ message: 'This combination is already present' });
    }
    console.error('Error adding team member:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};




export const getTeamMembers = async (req, res) => {
  const team_id = req.params.team_id;

  try {
    // Fetch team members from the database based on team_id
    const query = `
      SELECT tm.*, u.name as user_name, r.name as role_name
      FROM team_members tm
      INNER JOIN users u ON tm.user_id = u.id
      INNER JOIN roles r ON tm.role_id = r.id
      WHERE tm.team_id = ?
    `;
    const teamMembers = await db.query(query, [team_id]);

    res.status(200).json({ teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


