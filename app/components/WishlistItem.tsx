"use client"

import Image from "next/image"
import { StatusBadge } from "./StatusBadge"
import { EditStatusButton } from "./EditStatusButton"

interface WishlistItemProps {
  item: {
    id: number
    title: string
    description?: string
    price: number
    image_url: string
    priority: string
    category: {
      id: number
      name: string
    }
    status: {
      id: number
      name: string
    }
  }
  onRefresh: () => void
}

export function WishlistItem({ item, onRefresh }: WishlistItemProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="relative aspect-square">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
        <div className="mt-2">
          <p className="text-lg font-bold">R$ {item.price.toFixed(2)}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{item.category.name}</span>
            <StatusBadge status={item.status} />
          </div>
          <EditStatusButton 
            itemId={item.id}
            currentStatusId={item.status.id}
            onStatusChange={onRefresh}
          />
        </div>
      </div>
    </div>
  )
} 