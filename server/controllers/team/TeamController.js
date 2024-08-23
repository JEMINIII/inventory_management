import db from "../../models/db/DbModel.js";

// import db from "../../models/db/DbModel.js";

export const getAllTeam = async (req, res) => {
  try {
    // Extract orgId from the cookies
    const { orgId } = req.cookies;

    // Log the organization ID being used for the query
    console.log(`Fetching teams for orgId: ${orgId}`);

    // Ensure orgId is provided and valid
    if (!orgId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    // Fetch teams based on orgId using a parameterized query to prevent SQL injection
    const query = "SELECT * FROM team WHERE org_id = ?";
    const [rows] = await db.query(query, [orgId]);

    // Check if any teams were found for the given orgId
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No teams found for this organization" });
    }

    // Return the teams in the response
    res.json({ success: true, items: rows });
  } catch (error) {
    // Log the error message
    console.error("Error fetching teams:", error.message);

    // Send a generic error response to avoid exposing internal server details
    res.status(500).json({ error: "Internal server error" });
  }
};



export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate name
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Invalid team name" });
    }

    // Insert the name into the database
    const q = "INSERT INTO team (name) VALUES (?)";
    await db.query(q, [name]);

    res.json({ message: "Team created successfully" });
  } catch (error) {
    console.error("Error creating team:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const q = "SELECT name, image FROM inventory WHERE id = ?";
    const [rows] = await db.query(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    const teamData = { ...rows[0] };
    if (teamData.image && Buffer.isBuffer(teamData.image)) {
      try {
        teamData.image = teamData.image.toString('base64');
      } catch (err) {
        console.error("Error converting image to base64:", err.message);
        teamData.image = null;
      }
    } else {
      teamData.image = null;
    }

    res.json(teamData);
  } catch (error) {
    console.error("Error fetching team:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate name
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Invalid team name" });
    }

    console.log("Updating team with ID:", id, "New Name:", name);

    const q = "UPDATE team SET name = ? WHERE id = ?";
    await db.query(q, [name, id]);

    res.json({ message: "Team updated successfully" });
  } catch (error) {
    console.error("Error updating team:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const q = "DELETE FROM team WHERE id = ?";
    await db.query(q, [id]);

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// The commented-out `updateQuantity` function was removed as it seems to be unused.
