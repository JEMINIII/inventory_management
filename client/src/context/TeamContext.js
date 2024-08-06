import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import Team from "../pages/Team";

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
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
    console.log("Local Storage after change:", {
      selectedTeamId: localStorage.getItem("selectedTeamId"),
      selectedTeamName: localStorage.getItem("selectedTeamName"),
    });
  };

  useEffect(() => {
    const selectedOrgId = Cookies.get('orgId');
    const token = Cookies.get('token');

    console.log("Selected Org ID:", selectedOrgId);
    console.log("Retrieved token:", token);

    if (selectedOrgId) {
      axios
        .get(`http://localhost:8082/team?orgId=${selectedOrgId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setTeams(response.data.items);
            console.log(response.data);
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
      setTeams([]);
      console.log("No selectedOrgId or token found.");
    }
  }, []);

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
