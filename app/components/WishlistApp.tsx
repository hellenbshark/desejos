"use client"

import { useState } from "react"
import { AddItemForm } from "./AddItemForm"
import { WishlistView } from "./WishlistView"
import { Filters } from "./Filters"
import { Button } from "@/components/ui/button"
import { PlusCircle, List } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export type WishlistItem = {
  id: number
  name: string
  category: string
  status: "desejado" | "comprado" | "indisponível"
  priority: "baixa" | "média" | "alta"
  image: string
  description: string
}

export function WishlistApp() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  })
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)

  const addItem = (item: Omit<WishlistItem, "id">) => {
    setWishlist([...wishlist, { ...item, id: Date.now() }])
    setIsAddingItem(false)
  }

  const editItem = (updatedItem: WishlistItem) => {
    setWishlist(wishlist.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  const deleteItem = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id))
  }

  const filteredWishlist = wishlist.filter(
    (item) =>
      (filters.category === "all" || item.category === filters.category) &&
      (filters.status === "all" || item.status === filters.status),
  )

  return (
    <div className="min-h-screen bg-pink-50 text-gray-900">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">Minha Lista de Desejos</h1>
            <p className="text-pink-400">{wishlist.length} itens</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Item</DialogTitle>
                </DialogHeader>
                <AddItemForm addItem={addItem} />
              </DialogContent>
            </Dialog>
            <Link href="/wishlist" passHref className="w-full sm:w-auto">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white w-full">
                <List className="mr-2 h-4 w-4" />
                Ver Lista Completa
              </Button>
            </Link>
          </div>
        </div>
        {wishlist.length > 0 && <Filters filters={filters} setFilters={setFilters} />}
        {filteredWishlist.length > 0 ? (
          <WishlistView items={filteredWishlist} onEdit={setEditingItem} onDelete={deleteItem} />
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-pink-600">Sua lista de desejos está vazia. Adicione alguns itens!</p>
          </div>
        )}
      </div>
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Item</DialogTitle>
            </DialogHeader>
            <AddItemForm addItem={editItem} initialItem={editingItem} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

