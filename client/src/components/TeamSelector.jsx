import React, { useState, useEffect, useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { Select } from "antd";

const { Option } = Select;

const TeamSelector = () => {
  const { teamId, teams, changeTeam } = useContext(TeamContext);
  const [selectedTeamName, setSelectedTeamName] = useState('');
  console.log(selectedTeamName)
  useEffect(() => {
    // Update the selected team name when teams or teamId changes
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam) {
      setSelectedTeamName(selectedTeam.name);
    } else {
      setSelectedTeamName('');
    }
  }, [teamId, teams]);

  const handleTeamChange = (value) => {
    const selectedTeam = teams.find(team => team.id === value);
    changeTeam(value);
    setSelectedTeamName(selectedTeam ? selectedTeam.name : '');
    console.log(value);
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
