"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: {
    id: number;
    name: string;
  };
}

const statusStyles = {
  "Não Comprado": "bg-gray-100 text-gray-800",
  "Comprado": "bg-green-100 text-green-800",
  "Em Progresso": "bg-yellow-100 text-yellow-800",
  "Cancelado": "bg-red-100 text-red-800",
  "Em Espera": "bg-blue-100 text-blue-800"
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status.name as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
      )}
    >
      {status.name}
    </span>
  );
} 