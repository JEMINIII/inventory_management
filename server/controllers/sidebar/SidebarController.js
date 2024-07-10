import db from "../../models/db/DbModel.js";

export const getSidebarMenuItems = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debugging line

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user.id;
    const { teamId } = req.query;

    console.log('User ID:', userId);
    console.log('Selected Team ID:', teamId);

    // Fetch the user's role from the team_members table for the selected team
    const [roleRows] = await db.query(`
      SELECT roles.name as role_name, team_members.team_id
      FROM team_members 
      JOIN roles ON team_members.role_id = roles.id 
      WHERE team_members.user_id = ? AND team_members.team_id = ?
    `, [userId, teamId]);

    if (roleRows.length === 0) {
      return res.json([]); // Return empty array if role not found for the user in the selected team
    }

    const userRole = roleRows[0].role_name;

    // Fetch the menu items from the database
    const [menuRows] = await db.query("SELECT * FROM menu");

    const formattedMenuItems = menuRows.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      route: item.route,
      parent_id: item.parent_id,
    }));

    // Filter the menu items based on the user's role
    let filteredMenuItems;
    if (userRole === 'Admin') {
      filteredMenuItems = formattedMenuItems;
    } else if (userRole === 'Manager') {
      filteredMenuItems = formattedMenuItems.filter(item =>
        item.label === 'Item List' || item.label === 'Stock In' || item.label === 'Stock Out' || item.label === 'Settings' || item.label === 'Members' 
      );
    } else if (userRole === 'User') {
      filteredMenuItems = formattedMenuItems.filter(item =>
        item.label === 'Stock In' || item.label === 'Stock Out' 
      );
    } else {
      filteredMenuItems = []; // No menu items for other roles or unauthorized users
    }

    res.json(filteredMenuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};
