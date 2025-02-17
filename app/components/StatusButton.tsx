"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function StatusButton() {
  return (
    <Button variant="outline" className="flex items-center gap-2">
      <Settings className="h-4 w-4" />
      Status
    </Button>
  )
} 