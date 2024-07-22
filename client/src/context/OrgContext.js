// src/contexts/OrganizationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const OrganizationContext = createContext();

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
  const [selectedOrgId, setSelectedOrgId] = useState(() => {
    const storedOrgId = localStorage.getItem('selectedOrgId');
    return storedOrgId ? JSON.parse(storedOrgId) : '1';
  });

  const [selectedOrg, setSelectedOrg] = useState(() => {
    const storedOrg = localStorage.getItem('selectedOrg');
    return storedOrg ? JSON.parse(storedOrg) : { id: '1', name: 'Default Organization' }; // Adjust default value as needed
  });

  useEffect(() => {
    localStorage.setItem('selectedOrgId', JSON.stringify(selectedOrgId));
  }, [selectedOrgId]);

  useEffect(() => {
    localStorage.setItem('selectedOrg', JSON.stringify(selectedOrg));
  }, [selectedOrg]);

  return (
    <OrganizationContext.Provider value={{ selectedOrgId, setSelectedOrgId, selectedOrg, setSelectedOrg }}>
      {children}
    </OrganizationContext.Provider>
  );
};
