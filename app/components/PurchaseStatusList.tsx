'use client';
import { useState, useEffect } from 'react';

interface PurchaseStatus {
  id: number;
  name: string;
  description: string;
}

export default function PurchaseStatusList() {
  const [statuses, setStatuses] = useState<PurchaseStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await fetch('/api/purchase-status');
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Status de Compra</h3>
      <div className="grid gap-4">
        {statuses.map((status) => (
          <div key={status.id} className="p-4 border rounded">
            <h4 className="font-medium">{status.name}</h4>
            {status.description && (
              <p className="text-sm text-gray-600">{status.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 