'use client';
import { useState, useEffect } from 'react';

interface CategoryStat {
  category_name: string;
  total_items: number;
  purchased_items: number;
  pending_items: number;
  avg_price: string | null;
  total_price: string | null;
  last_item_date: string;
}

export default function CategoryStats({ userId }: { userId: number }) {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/stats/category?user_id=${userId}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) return <div>Carregando estatísticas...</div>;

  const formatPrice = (price: string | null) => {
    if (!price) return 'R$ 0,00';
    const numPrice = parseFloat(price);
    return `R$ ${numPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Estatísticas por Categoria</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.category_name} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">{stat.category_name}</h3>
            <div className="mt-2 space-y-1">
              <p>Total de itens: {stat.total_items}</p>
              <p>Comprados: {stat.purchased_items}</p>
              <p>Pendentes: {stat.pending_items}</p>
              <p>Preço médio: {formatPrice(stat.avg_price)}</p>
              <p>Total: {formatPrice(stat.total_price)}</p>
              <p>Último item: {new Date(stat.last_item_date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 