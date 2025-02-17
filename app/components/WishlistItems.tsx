'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface WishlistItem {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  priority: 'low' | 'medium' | 'high';
  url?: string;
  image_url?: string;
  category_name: string;
  category_icon: string;
  status_name: string;
  purchase_date?: string;
  purchase_price?: number;
  purchased_by_name?: string;
}

interface WishlistItemsProps {
  userId: number;
}

export default function WishlistItems({ userId }: WishlistItemsProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, [userId]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/wishlist?user_id=${userId}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPurchased = async (itemId: number, purchasePrice: number) => {
    try {
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
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
              R$ {item.price.toFixed(2)}
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
              <p>Preço de compra: R$ {item.purchase_price?.toFixed(2)}</p>
              {item.purchased_by_name && <p>Comprado por: {item.purchased_by_name}</p>}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => router.push('/wishlist/new')}
        className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
        + Novo Item
      </button>
    </div>
  );
} 