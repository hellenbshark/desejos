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
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface PurchaseStatus {
  id: number;
  name: string;
  description?: string;
}

export function PurchaseStatusDialog() {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<PurchaseStatus[]>([]);
  const [editingStatus, setEditingStatus] = useState<PurchaseStatus | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await fetch('/api/purchase-status');
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
      toast.error('Erro ao carregar status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/purchase-status', {
        method: editingStatus ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingStatus 
            ? { ...formData, id: editingStatus.id }
            : formData
        ),
      });

      if (response.ok) {
        await fetchStatuses();
        setFormData({ name: '', description: '' });
        setEditingStatus(null);
        toast.success(
          editingStatus 
            ? 'Status atualizado com sucesso'
            : 'Status criado com sucesso'
        );
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao salvar status');
      }
    } catch (error) {
      console.error('Erro ao salvar status:', error);
      toast.error('Erro ao salvar status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este status?')) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/purchase-status?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchStatuses();
        toast.success('Status excluído com sucesso');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao excluir status');
      }
    } catch (error) {
      console.error('Erro ao excluir status:', error);
      toast.error('Erro ao excluir status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="w-4 h-4 mr-2" />
          Gerenciar Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingStatus ? 'Editar Status' : 'Gerenciar Status de Compra'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2">
            {editingStatus && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingStatus(null);
                  setFormData({ name: '', description: '' });
                }}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {editingStatus ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>

        <div className="space-y-2 mt-4">
          <Label>Status Existentes</Label>
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <span className="font-medium">{status.name}</span>
                {status.description && (
                  <p className="text-sm text-gray-600">{status.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingStatus(status);
                    setFormData({
                      name: status.name,
                      description: status.description || ''
                    });
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(status.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 