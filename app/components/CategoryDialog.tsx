"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { useCategories } from '@/app/contexts/CategoryContext'

interface Category {
  id: number;
  name: string;
}

export function CategoryDialog() {
  const { categories, refreshCategories } = useCategories();
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshCategories();
        setNewCategoryName('');
        toast.success('Categoria criada com sucesso');
      } else {
        toast.error(data.error, {
          duration: 5000,
          style: { 
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #dc2626',
            padding: '12px'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast.error('Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    setLoading(true);

    try {
      console.log('Enviando atualização:', { 
        id: editingCategory.id, 
        name: newCategoryName 
      });

      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingCategory.id,
          name: newCategoryName 
        }),
      });

      if (response.ok) {
        await refreshCategories();
        setEditingCategory(null);
        setNewCategoryName('');
        toast.success('Categoria atualizada com sucesso');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao atualizar categoria');
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error('Erro ao atualizar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setLoading(true);

      const checkResponse = await fetch(`/api/categories/check-usage?id=${id}`);
      const checkData = await checkResponse.json();

      if (checkData.inUse) {
        toast.error("Esta categoria não pode ser excluída pois está sendo usada em itens da wishlist", {
          duration: 5000,
          style: { 
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #dc2626',
            padding: '12px',
            maxWidth: '400px'
          }
        });
        return;
      }

      if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
        return;
      }

      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await refreshCategories();
        toast.success('Categoria excluída com sucesso');
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle className="w-4 h-4 mr-2" />
            Gerenciar Categorias
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Gerenciar Categorias'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da categoria"
              />
              <Button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                disabled={loading || !newCategoryName.trim()}
              >
                {editingCategory ? 'Atualizar' : 'Criar'}
              </Button>
              {editingCategory && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategoryName('');
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categorias Existentes</Label>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setNewCategoryName(category.name);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteAlert(false);
              setCategoryToDelete(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowDeleteAlert(false);
              setCategoryToDelete(null);
            }}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 