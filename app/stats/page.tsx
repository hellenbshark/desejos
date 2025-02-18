"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import CategoryStats from "@/app/components/CategoryStats"
import DetailedStats from "@/app/components/DetailedStats"

export default function StatsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/wishlist')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Wishlist
        </Button>
        <h1 className="text-2xl font-bold">Estatísticas</h1>
      </div>

      <div className="space-y-8">
        <CategoryStats userId={1} />
        <DetailedStats userId={1} />
        
        {/* Aqui podemos adicionar mais componentes de estatísticas no futuro */}
      </div>
    </div>
  );
} 