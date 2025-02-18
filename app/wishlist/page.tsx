"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddItemDialog } from "@/app/components/AddItemDialog"
import WishlistItems from "@/app/components/WishlistItems"

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

      <WishlistItems userId={1} />
    </div>
  );
}
