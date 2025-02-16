import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { WishlistItem } from "./WishlistApp"

type WishlistViewProps = {
  items: WishlistItem[]
  onEdit: (item: WishlistItem) => void
  onDelete: (id: number) => void
}

export function WishlistView({ items, onEdit, onDelete }: WishlistViewProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="aspect-square relative">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover w-full h-full" />
            <Badge
              className={`absolute top-2 right-2 ${
                item.priority === "alta" ? "bg-red-500" : item.priority === "média" ? "bg-yellow-500" : "bg-green-500"
              } text-white`}
            >
              {item.priority}
            </Badge>
          </div>
          <CardHeader className="p-4">
            <h3 className="text-lg font-semibold text-pink-800 line-clamp-1">{item.name}</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300">
                {item.category}
              </Badge>
              <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300">
                {item.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-pink-600 border-pink-300 hover:bg-pink-50"
                onClick={() => onEdit(item)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

