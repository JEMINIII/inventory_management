// File: src/context/TeamContext.js

import React, { createContext, useState } from 'react';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teamId, setTeamId] = useState(() => {
    const savedTeamId = localStorage.getItem('selectedTeamId');
    return savedTeamId ? parseInt(savedTeamId, 10) : null;
  });

  const changeTeam = (id) => {
    setTeamId(id);
    localStorage.setItem('selectedTeamId', id);
  };

  const value = {
    teamId,
    setTeamId,
    changeTeam
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};
