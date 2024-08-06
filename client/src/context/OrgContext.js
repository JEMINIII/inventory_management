import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const OrganizationContext = createContext();

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
  const [selectedOrgId, setSelectedOrgId] = useState(() => {
    const storedOrgId = Cookies.get('orgId');
    return storedOrgId ? JSON.parse(storedOrgId) : null;
  });

  useEffect(() => {
    if (selectedOrgId) {
      Cookies.set('orgId', JSON.stringify(selectedOrgId));
    } else {
      Cookies.remove('orgId');
    }
  }, [selectedOrgId]);

  return (
    <OrganizationContext.Provider value={{ selectedOrgId, setSelectedOrgId }}>
      {children}
    </OrganizationContext.Provider>
  );
};
