"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type React from "react"

type FiltersProps = {
  filters: {
    category: string
    status: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string
      status: string
    }>
  >
}

export function Filters({ filters, setFilters }: FiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow">
      <div>
        <Label htmlFor="category-filter" className="text-sm font-medium text-pink-800">
          Categoria
        </Label>
        <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
          <SelectTrigger id="category-filter" className="w-full mt-1 bg-white border-pink-300 focus:border-pink-500">
            <SelectValue placeholder="Todas as Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
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
        <Label htmlFor="status-filter" className="text-sm font-medium text-pink-800">
          Status
        </Label>
        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <SelectTrigger id="status-filter" className="w-full mt-1 bg-white border-pink-300 focus:border-pink-500">
            <SelectValue placeholder="Todos os Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="desejado">Desejado</SelectItem>
            <SelectItem value="comprado">Comprado</SelectItem>
            <SelectItem value="indisponível">Indisponível</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

