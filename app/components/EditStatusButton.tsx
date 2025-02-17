"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStatuses } from "@/app/contexts/StatusContext"
import { toast } from "sonner"

interface EditStatusButtonProps {
  itemId: number
  currentStatusId: number
  onStatusChange: () => void
}

export function EditStatusButton({ itemId, currentStatusId, onStatusChange }: EditStatusButtonProps) {
  const { statuses } = useStatuses()
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatusId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status_id: parseInt(newStatusId)
        })
      })

      if (response.ok) {
        toast.success('Status atualizado com sucesso')
        onStatusChange()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao atualizar status')
      }
    } catch (error) {
      toast.error('Erro ao atualizar status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select
      defaultValue={currentStatusId.toString()}
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.id} value={status.id.toString()}>
            {status.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 