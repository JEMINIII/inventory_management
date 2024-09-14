import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

export const TeamContext = createContext();
const api_address = process.env.REACT_APP_API_ADDRESS;
export const TeamProvider = ({ children }) => {
  const [teamId, setTeamId] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [teams, setTeams] = useState([]);
  const [sidebarItems, setSidebarItems] = useState([]);

  const changeTeam = (id, name) => {
    setTeamId(id);
    setTeamName(name);
    localStorage.setItem("selectedTeamId", id);
    localStorage.setItem("selectedTeamName", name);
    console.log("Team changed:", { id, name });
  };

  useEffect(() => {
    const selectedOrgId = Cookies.get('orgId');
    const token = Cookies.get('token');

    if (selectedOrgId) {
      axios
        .get(`http://localhost:8082/team?orgId=${selectedOrgId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        })
        .then((response) => {
          if (response.data.success) {
            const fetchedTeams = response.data.items;
            setTeams(fetchedTeams);
            console.log("Teams fetched:", fetchedTeams);

            const savedTeamId = localStorage.getItem("selectedTeamId");
            const savedTeamName = localStorage.getItem("selectedTeamName");

            // Set default team after fetching if none is set
            if (!savedTeamId && fetchedTeams.length > 0) {
              const firstTeam = fetchedTeams[0];
              changeTeam(firstTeam.id, firstTeam.name);
            } else {
              setTeamId(parseInt(savedTeamId, 10));
              setTeamName(savedTeamName);
            }
          } else {
            console.error("Failed to fetch teams:", response.data.message || "Unknown error");
          }
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
        });
    } else {
      setTeams([]);
      console.log("No selectedOrgId or token found.");
    }
  }, []); // Empty dependency array to ensure it runs only once on mount

  useEffect(() => {
    const selectedOrgId = Cookies.get('orgId');
    const token = Cookies.get('token');

    if (teamId && selectedOrgId) {
      axios
        .get(`${api_address}/sidebar?teamId=${teamId}&orgId=${selectedOrgId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            const fetchedSidebarItems = response.data;
            setSidebarItems(fetchedSidebarItems);
            console.log("Sidebar items fetched:", fetchedSidebarItems);
          } else {
            console.error("Failed to fetch sidebar items:", response.data.message || "Unknown error");
          }
        })
        .catch((error) => {
          console.error("Error fetching sidebar items:", error);
        });
    }
  }, [teamId]); // Only fetch sidebar items when teamId changes

  const value = {
    teamId,
    teamName,
    teams,
    sidebarItems,
    changeTeam,
    setTeamId,
    setTeamName
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};