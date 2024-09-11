import React, { useState, useEffect, useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { Select } from "antd";

const { Option } = Select;

const TeamSelector = () => {
  const { teamId, teams, changeTeam } = useContext(TeamContext);
  const [selectedTeamName, setSelectedTeamName] = useState('');

  // Set the default team if none is selected
  useEffect(() => {
    if (!teamId && teams.length > 0) {
      const firstTeam = teams[0];
      changeTeam(firstTeam.id, firstTeam.name);
    }
  }, [teams, teamId, changeTeam]);

  // Update selectedTeamName when teamId or teams change
  useEffect(() => {
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam) {
      setSelectedTeamName(selectedTeam.name);
    } else {
      setSelectedTeamName(''); // Clear the name if no matching team is found
    }
  }, [teamId, teams]);

  const handleTeamChange = (value) => {
    const selectedTeam = teams.find(team => team.id === value);
    if (selectedTeam) {
      changeTeam(selectedTeam.id, selectedTeam.name);
    }
  };

  return (
    <Select 
      value={selectedTeamName || undefined} 
      className="team-selector"
      onChange={handleTeamChange}
      placeholder="Select Team"
      optionLabelProp="label"
      dropdownStyle={{ maxHeight: 200, overflowY: 'auto' }}
    >
      {teams.map((team) => (
        <Option 
          key={team.id} 
          value={team.id} 
          label={team.name}
        >
          {team.name}
        </Option>
      ))}
    </Select>
  );
};

export default TeamSelector;