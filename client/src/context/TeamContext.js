import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useOrganization } from "./OrgContext";

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { selectedOrgId } = useOrganization(); // Get selectedOrgId from OrganizationContext

  const [teamId, setTeamId] = useState(() => {
    const savedTeamId = localStorage.getItem("selectedTeamId");
    return savedTeamId ? parseInt(savedTeamId, 10) : null;
  });

  const [teamName, setTeamName] = useState(() => {
    const savedTeamName = localStorage.getItem("selectedTeamName");
    return savedTeamName || null;
  });

  const [teams, setTeams] = useState([]);

  const changeTeam = (id, name) => {
    setTeamId(id);
    setTeamName(name);
    localStorage.setItem("selectedTeamId", id);
    localStorage.setItem("selectedTeamName", name);
    console.log("Team changed:", { id, name });
  };

  useEffect(() => {
    console.log("Selected Org ID:", selectedOrgId);
    if (selectedOrgId) {
      axios
        .get(`http://37.60.244.17:8082/team?orgId=${selectedOrgId}`, {
          headers: {
            Authorization: `Bearer YOUR_API_TOKEN_HERE`, // Add this if your API requires token-based authentication
          },
        })
        .then((response) => {
          if (response.data.success) {
            setTeams(response.data.items);
          } else {
            console.error(
              "Failed to fetch teams:",
              response.data.message || "Unknown error"
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
        });
    } else {
      // Optional: Clear teams if no organization is selected
      setTeams([]);
    }
  }, [selectedOrgId]);

  useEffect(() => {
    const savedTeamId = localStorage.getItem("selectedTeamId");
    const savedTeamName = localStorage.getItem("selectedTeamName");
    console.log("Loaded from localStorage:", { savedTeamId, savedTeamName });
  }, []);

  const value = {
    teamId,
    teamName,
    teams,
    changeTeam,
    setTeamId,
    setTeamName,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
