// TeamContext.js
import React, { createContext, useState } from "react";

const TeamContext = createContext();

const TeamProvider = ({ children }) => {
  const [teamId, setTeamId] = useState(null);

  return (
    <TeamContext.Provider value={{ teamId, setTeamId }}>
      {children}
    </TeamContext.Provider>
  );
};

export { TeamContext, TeamProvider };
