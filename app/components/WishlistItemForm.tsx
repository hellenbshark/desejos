"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface WishlistItem {
  id?: number;
  title: string;
  description?: string;
  price?: number;
  category_id: number;
  priority: 'low' | 'medium' | 'high';
  url?: string;
  image_url?: string;
  status_name?: string;
  purchase_price?: number;
  mark_as_purchased?: boolean;
}

interface WishlistItemFormProps {
  item?: WishlistItem;
  onSubmit: (data: WishlistItem) => void;
  onCancel: () => void;
}

export function WishlistItemForm({ item, onSubmit, onCancel }: WishlistItemFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [markAsPurchased, setMarkAsPurchased] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<WishlistItem>({
    defaultValues: item || {
      priority: 'medium',
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (data: WishlistItem) => {
    setLoading(true);
    try {
      if (markAsPurchased) {
        data.purchase_price = data.price;
      }
      await onSubmit({ ...data, mark_as_purchased: markAsPurchased });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? 'Editar Item' : 'Novo Item'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Título é obrigatório' })}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Categoria *</Label>
            <Controller
              name="category_id"
              control={control}
              rules={{ required: 'Categoria é obrigatória' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category_id && (
              <p className="text-sm text-red-600">{errors.category_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', { min: 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Controller
                name="priority"
                control={control}
                defaultValue="medium"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL do Produto</Label>
            <Input
              id="url"
              type="url"
              {...register('url')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL da Imagem</Label>
            <Input
              id="image_url"
              type="url"
              {...register('image_url')}
            />
          </div>

          {item && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mark_as_purchased"
                checked={markAsPurchased}
                onCheckedChange={(checked) => setMarkAsPurchased(checked as boolean)}
              />
              <Label htmlFor="mark_as_purchased">
                Marcar como comprado
              </Label>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : item ? 'Atualizar' : 'Adicionar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
