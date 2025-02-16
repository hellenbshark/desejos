"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { WishlistItem } from "./WishlistApp"
import type React from "react"

type AddItemFormProps = {
  addItem: (item: Omit<WishlistItem, "id"> | WishlistItem) => void
  initialItem?: WishlistItem
}

export function AddItemForm({ addItem, initialItem }: AddItemFormProps) {
  const [name, setName] = useState(initialItem?.name || "")
  const [category, setCategory] = useState(initialItem?.category || "")
  const [status, setStatus] = useState<WishlistItem["status"]>(initialItem?.status || "desejado")
  const [priority, setPriority] = useState<WishlistItem["priority"]>(initialItem?.priority || "média")
  const [image, setImage] = useState(initialItem?.image || "")
  const [description, setDescription] = useState(initialItem?.description || "")

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name)
      setCategory(initialItem.category)
      setStatus(initialItem.status)
      setPriority(initialItem.priority)
      setImage(initialItem.image)
      setDescription(initialItem.description)
    }
  }, [initialItem])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && category) {
      const newItem = {
        id: initialItem?.id || Date.now(),
        name,
        category,
        status,
        priority,
        image,
        description,
      }
      addItem(newItem)
      if (!initialItem) {
        setName("")
        setCategory("")
        setStatus("desejado")
        setPriority("média")
        setImage("")
        setDescription("")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label htmlFor="name" className="text-sm">
            Nome do Item
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-pink-300 focus:border-pink-500 mt-1"
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-sm">
            Categoria
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border-pink-300 focus:border-pink-500 mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
              <SelectItem value="Esportes">Esportes</SelectItem>
              <SelectItem value="Livros">Livros</SelectItem>
              <SelectItem value="Roupas">Roupas</SelectItem>
              <SelectItem value="Bolsas">Bolsas</SelectItem>
              <SelectItem value="Maquiagens">Maquiagens</SelectItem>
              <SelectItem value="Acessórios">Acessórios</SelectItem>
              <SelectItem value="Casa e Decoração">Casa e Decoração</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status" className="text-sm">
            Status
          </Label>
          <Select value={status} onValueChange={(value: WishlistItem["status"]) => setStatus(value)}>
            <SelectTrigger className="border-pink-300 focus:border-pink-500 mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desejado">Desejado</SelectItem>
              <SelectItem value="comprado">Comprado</SelectItem>
              <SelectItem value="indisponível">Indisponível</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority" className="text-sm">
            Prioridade
          </Label>
          <Select value={priority} onValueChange={(value: WishlistItem["priority"]) => setPriority(value)}>
            <SelectTrigger className="border-pink-300 focus:border-pink-500 mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="média">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="image" className="text-sm">
            URL da Imagem
          </Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="border-pink-300 focus:border-pink-500 mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description" className="text-sm">
          Descrição
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o item..."
          rows={2}
          className="border-pink-300 focus:border-pink-500 mt-1"
        />
      </div>
      <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
        {initialItem ? "Atualizar Item" : "Adicionar Item"}
      </Button>
    </form>
  )
}

