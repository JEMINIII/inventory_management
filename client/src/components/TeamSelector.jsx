import React, { useState, useEffect, useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { Select } from "antd";

const { Option } = Select;

const TeamSelector = () => {
  const { teamId, teams, changeTeam } = useContext(TeamContext);
  const [selectedTeamName, setSelectedTeamName] = useState('');

  useEffect(() => {
    // Set default teamId to the first team if no teamId is set
    if (!teamId && teams.length > 0) {
      const firstTeam = teams[0];
      changeTeam(firstTeam.id, firstTeam.name);
    }
  }, [teams, teamId, changeTeam]);

  useEffect(() => {
    // Update the selected team name based on the current teamId
    const selectedTeam = teams.find(team => team.id === teamId);
    setSelectedTeamName(selectedTeam ? selectedTeam.name : '');
  }, [teamId, teams]);

  const handleTeamChange = (value) => {
    const selectedTeam = teams.find(team => team.id === value);
    changeTeam(value, selectedTeam ? selectedTeam.name : '');
    setSelectedTeamName(selectedTeam ? selectedTeam.name : '');
  };

  return (
    <Select 
      value={selectedTeamName || undefined} 
      style={{ width: 200 }} 
      onChange={handleTeamChange}
      dropdownStyle={{ maxHeight: 200, overflowY: 'auto', background: 'white' }}
      placeholder="Select Team"
      optionLabelProp="label"
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
