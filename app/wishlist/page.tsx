"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddItemDialog } from "@/app/components/AddItemDialog"

interface WishlistItem {
  id: number
  title: string
  description?: string
  price?: number
  category_name: string
  priority: 'low' | 'medium' | 'high'
  status_name: string
  url?: string
  image_url?: string
}

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/wishlist?user_id=1');
      const data = await response.json();
      console.log('Itens recebidos:', data);
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minha Wishlist</h1>
        <AddItemDialog onItemAdded={fetchItems} />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Sua wishlist está vazia. Clique em "Adicionar Item" para começar!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <CardTitle className="flex justify-between items-start">
                  <span>{item.title}</span>
                  <Badge variant={
                    item.priority === 'high' ? 'destructive' :
                    item.priority === 'medium' ? 'default' :
                    'secondary'
                  }>
                    {item.priority}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.description && (
                    <p className="text-gray-600">{item.description}</p>
                  )}
                  {item.price && (
                    <p className="text-lg font-bold">
                      R$ {typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {item.category_name}
                    </span>
                    <Badge variant={item.status_name === 'Comprado' ? 'success' : 'default'}>
                      {item.status_name}
                    </Badge>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Ver produto
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
