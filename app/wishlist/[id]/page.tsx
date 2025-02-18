"use client"

import { useEffect, useState } from 'react';
import ItemNotes from '@/app/components/ItemNotes';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function WishlistItemPage({ params }: { params: { id: string } }) {
  const userId = 1; // Temporário - deve vir da autenticação
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => router.push('/wishlist')}
        variant="ghost"
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Wishlist
      </Button>

      {/* ... detalhes do item ... */}
      
      <ItemNotes 
        itemId={parseInt(params.id)} 
        userId={userId} 
      />
    </div>
  );
} 