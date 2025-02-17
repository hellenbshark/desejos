'use client';
import { useState, useEffect } from 'react';

interface WishlistStats {
  total_items: number;
  wanted_items: number;
  purchased_items: number;
  total_wanted_price: number;
  total_spent: number;
}

interface WishlistStatsProps {
  userId: number;
}

export default function WishlistStats({ userId }: WishlistStatsProps) {
  const [stats, setStats] = useState<WishlistStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats?user_id=${userId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold">Total de Itens</h3>
        <p className="text-2xl">{stats.total_items}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold">Itens Desejados</h3>
        <p className="text-2xl">{stats.wanted_items}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold">Itens Comprados</h3>
        <p className="text-2xl">{stats.purchased_items}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold">Total Gasto</h3>
        <p className="text-2xl">R$ {stats.total_spent?.toFixed(2)}</p>
      </div>
    </div>
  );
} 