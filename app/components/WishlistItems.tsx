'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WishlistItem {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: string | number;
  priority: 'low' | 'medium' | 'high';
  url?: string;
  image_url?: string;
  category_name: string;
  category_icon: string;
  status_name: string;
  purchase_date?: string;
  purchase_price?: string | number;
  purchased_by_name?: string;
}

interface WishlistItemsProps {
  userId: number;
}

export default function WishlistItems({ userId }: WishlistItemsProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Função simplificada de busca
  const fetchItems = async (search?: string) => {
    try {
      setLoading(true);
      const url = new URL('/api/wishlist', window.location.origin);
      url.searchParams.append('user_id', userId.toString());
      
      if (search?.trim()) {
        url.searchParams.append('search', search.trim());
      }

      const response = await fetch(url);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar itens iniciais
  useEffect(() => {
    fetchItems();
  }, [userId]);

  // Busca com timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const markAsPurchased = async (itemId: number, price: string | number) => {
    try {
      const purchasePrice = typeof price === 'string' ? parseFloat(price) : price;
      
      const response = await fetch('/api/wishlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          purchase_price: purchasePrice,
          purchased_by: userId
        }),
      });

      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Erro ao marcar como comprado:', error);
    }
  };

  const deleteItem = async (itemId: number) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    try {
      const response = await fetch(`/api/wishlist?id=${itemId}&user_id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de busca em destaque */}
      <div className="sticky top-0 bg-white p-4 shadow-sm z-10">
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Mensagem de resultados */}
      {searchTerm && (
        <div className="text-center text-sm text-gray-500">
          {items.length === 0 
            ? `Nenhum item encontrado para "${searchTerm}"`
            : `${items.length} item(s) encontrado(s) para "${searchTerm}"`
          }
        </div>
      )}

      {/* Lista de itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm">
            {item.image_url && (
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg mb-2"
              />
            )}
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                item.priority === 'high' ? 'bg-red-100 text-red-800' :
                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.priority}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span className="mr-2">{item.category_icon}</span>
              <span>{item.category_name}</span>
            </div>

            <p className="text-gray-600 mb-2">{item.description}</p>
            
            {item.price && (
              <p className="text-lg font-bold mb-2">
                R$ {typeof item.price === 'number' 
                  ? item.price.toFixed(2) 
                  : parseFloat(item.price).toFixed(2)}
              </p>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="space-x-2">
                <button
                  onClick={() => router.push(`/wishlist/${item.id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Detalhes
                </button>
                {item.status_name !== 'Comprado' && (
                  <button
                    onClick={() => markAsPurchased(item.id, item.price)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Marcar como Comprado
                  </button>
                )}
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Deletar
              </button>
            </div>

            {item.status_name === 'Comprado' && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Comprado em: {new Date(item.purchase_date!).toLocaleDateString()}</p>
                <p>Preço de compra: R$ {
                  item.purchase_price 
                    ? (typeof item.purchase_price === 'string' 
                      ? parseFloat(item.purchase_price).toFixed(2) 
                      : item.purchase_price.toFixed(2))
                    : '0.00'
                }</p>
                {item.purchased_by_name && <p>Comprado por: {item.purchased_by_name}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 