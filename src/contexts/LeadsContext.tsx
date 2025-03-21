import React, { createContext, useState, ReactNode } from 'react';
import { LeadData, LeadsContextType } from '../types';
import { initialLeads } from '../data/initialData';

// Create context with default values
export const LeadsContext = createContext<LeadsContextType>({
  leads: [],
  updateLead: () => {},
});

// Leads Provider Component
export const LeadsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [leads, setLeads] = useState<LeadData[]>(initialLeads);

  const updateLead = (id: string, data: Partial<LeadData>) => {
    setLeads(
      leads.map((lead) => (lead.id === id ? { ...lead, ...data } : lead))
    );
  };

  return (
    <LeadsContext.Provider value={{ leads, updateLead }}>
      {children}
    </LeadsContext.Provider>
  );
};
