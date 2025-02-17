"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Edit2, Trash2, Settings } from "lucide-react"
import { toast } from "sonner"
import { useStatuses } from '@/app/contexts/StatusContext'

interface PurchaseStatus {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export function StatusDialog() {
  const { statuses, refreshStatuses } = useStatuses();
  const [open, setOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<PurchaseStatus | null>(null);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusDescription, setNewStatusDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateStatus = async () => {
    if (!newStatusName.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/purchase-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStatusName }),
      });

      if (response.ok) {
        await refreshStatuses();
        setNewStatusName('');
        toast.success('Status criado com sucesso');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao criar status');
      }
    } catch (error) {
      toast.error('Erro ao criar status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!editingStatus || !newStatusName.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/purchase-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingStatus.id,
          name: newStatusName,
          description: newStatusDescription 
        }),
      });

      if (response.ok) {
        await refreshStatuses();
        setEditingStatus(null);
        setNewStatusName('');
        setNewStatusDescription('');
        toast.success('Status atualizado com sucesso');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStatus = async (id: number) => {
    try {
      setLoading(true);

      if (!confirm('Tem certeza que deseja excluir este status?')) {
        return;
      }

      const response = await fetch(`/api/purchase-status?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await refreshStatuses();
        toast.success('Status excluído com sucesso');
      } else {
        const data = await response.json();
        toast.error(data.error);
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
          <Settings className="w-4 h-4 mr-2" />
          Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              placeholder="Nome do status"
            />
            <Button
              onClick={handleCreateStatus}
              disabled={loading || !newStatusName.trim()}
            >
              Criar
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Status Existentes</Label>
            {statuses.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{status.name}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 