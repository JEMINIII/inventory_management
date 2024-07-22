// File path: src/components/TeamSelector.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { TeamContext } from "../context/TeamContext";
import { Select } from "antd";

const { Option } = Select;
const api_address = process.env.REACT_APP_API_ADDRESS;

const TeamSelector = () => {
  const { teamId, changeTeam } = useContext(TeamContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  useEffect(() => {
    axios
      .get(`${api_address}/team`)
      .then((response) => {
        if (response.data.success) {
          setTeams(response.data.items);
          // If teamId exists, find and set the team name
          const selectedTeam = response.data.items.find(
            (team) => team.id === teamId
          );
          if (selectedTeam) {
            setSelectedTeamName(selectedTeam.name);
          }
        } else {
          console.error("Failed to fetch teams");
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, [teamId]);

  const handleTeamChange = (value) => {
    const selectedTeam = teams.find((team) => team.id === value);
    changeTeam(value);
    setSelectedTeamName(selectedTeam ? selectedTeam.name : "");
    console.log(value);
  };

  return (
    <Select
      value={selectedTeamName || undefined}
      style={{ width: 200 }}
      onChange={handleTeamChange}
      dropdownStyle={{ maxHeight: 200, overflowY: "auto", background: "white" }}
      placeholder="Select Team"
      optionLabelProp="label"
    >
      {teams.map((team) => (
        <Option key={team.id} value={team.id} label={team.name}>
          {team.name}
        </Option>
      ))}
    </Select>
  );
};

export default TeamSelector;
