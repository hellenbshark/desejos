"use client"

import { Button } from "@/components/ui/button"
import { Settings, PlusCircle } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [items, setItems] = useState([])

  return (
    <main className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Minha Wishlist</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Gerenciar Status
          </Button>
          <Button variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Lista de itens aqui */}
      </div>
    </main>
  )
}
