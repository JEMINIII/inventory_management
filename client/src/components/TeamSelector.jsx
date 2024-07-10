// TeamSelector.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TeamContext } from '../context/TeamContext';

const TeamSelector = () => {
  const { teamId, changeTeam } = useContext(TeamContext);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/team')
      .then((response) => {
        
        if (response.data.success) {
          setTeams(response.data.items);
          
        } else {
          console.error("Failed to fetch teams");
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleTeamChange = (e) => {
    const selectedTeamId = e.target.value;
    changeTeam(selectedTeamId);
    console.log(selectedTeamId)
  };

  return (
    <select value={teamId || ''} style={{ backgroundColor:'black',color:'white',border:'none' }} onChange={handleTeamChange}>
      <option value="">Select Team</option>
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
};

export default TeamSelector;
