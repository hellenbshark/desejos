'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DetailedStat {
  category_name: string;
  category_id: number;
  total_items: number;
  premium_items: number;
  purchased_items: number;
  pending_items: number;
  avg_price: string | null;
  total_price: string | null;
  above_avg_price: string;
  last_item_date: string;
}

export default function DetailedStats({ userId }: { userId: number }) {
  const [stats, setStats] = useState<DetailedStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('total_items');
  const [order, setOrder] = useState('DESC');

  useEffect(() => {
    fetchStats();
  }, [userId, sortBy, order]);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `/api/stats/detailed?user_id=${userId}&sort_by=${sortBy}&order=${order}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas detalhadas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando estatísticas detalhadas...</div>;

  const formatPrice = (price: string | null) => {
    if (!price) return 'R$ 0,00';
    const numPrice = parseFloat(price);
    return `R$ ${numPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Análise Detalhada por Categoria</h2>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total_items">Total de Itens</SelectItem>
              <SelectItem value="avg_price">Preço Médio</SelectItem>
              <SelectItem value="total_price">Preço Total</SelectItem>
              <SelectItem value="purchased_items">Itens Comprados</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')}
          >
            {order === 'ASC' ? '↑' : '↓'}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.category_id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">{stat.category_name}</h3>
            <div className="mt-2 space-y-1">
              <p>Total de itens: {stat.total_items}</p>
              <p>Itens premium: {stat.premium_items}</p>
              <p>Itens econômicos: {stat.budget_items}</p>
              <p>Preço médio: {formatPrice(stat.avg_price)}</p>
              <p>Acima da média global: {stat.above_avg_price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 