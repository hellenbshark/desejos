"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, Edit2, Trash2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { WishlistItemForm } from "@/app/components/WishlistItemForm"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WishlistItem {
  id: number
  title: string
  description?: string
  price?: number
  category_id: number
  category_name: string
  priority: 'low' | 'medium' | 'high'
  status: 'wanted' | 'bought'
  url?: string
  image_url?: string
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/auth');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const loadItems = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async (item: Omit<WishlistItem, 'id' | 'category_name' | 'status'>) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        await loadItems();
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (item: WishlistItem) => {
    try {
      const response = await fetch(`/api/wishlist/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        await loadItems();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minha Wishlist</h1>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <WishlistItemForm
                onSubmit={handleAddItem}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            {item.image_url && (
              <div className="relative aspect-video">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <Badge className={getPriorityColor(item.priority)}>
                  {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {item.description && <p className="text-gray-600 mb-2">{item.description}</p>}
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Categoria:</span> {item.category_name}
                </p>
                {item.price && (
                  <p className="text-sm">
                    <span className="font-semibold">Preço:</span> R$ {item.price.toFixed(2)}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setEditingItem(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <WishlistItemForm
                      item={editingItem || undefined}
                      onSubmit={handleEditItem}
                      onCancel={() => setEditingItem(null)}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {item.url && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Sua wishlist está vazia. Clique em "Adicionar Item" para começar!
          </p>
        </div>
      )}
    </div>
  )
}
