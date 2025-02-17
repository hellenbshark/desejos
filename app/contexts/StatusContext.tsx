"use client"

import { createContext, useContext, useState, useEffect } from 'react';

interface PurchaseStatus {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

interface StatusContextType {
  statuses: PurchaseStatus[];
  refreshStatuses: () => Promise<void>;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState<PurchaseStatus[]>([]);

  const refreshStatuses = async () => {
    try {
      const response = await fetch('/api/purchase-status');
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  useEffect(() => {
    refreshStatuses();
  }, []);

  return (
    <StatusContext.Provider value={{ statuses, refreshStatuses }}>
      {children}
    </StatusContext.Provider>
  );
}

export function useStatuses() {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatuses deve ser usado dentro de um StatusProvider');
  }
  return context;
} 