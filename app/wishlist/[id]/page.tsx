"use client"

import { useEffect, useState } from 'react';
import ItemNotes from '@/app/components/ItemNotes';

export default function WishlistItemPage({ params }: { params: { id: string } }) {
  const userId = 1; // Temporário - deve vir da autenticação

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... detalhes do item ... */}
      
      <ItemNotes 
        itemId={parseInt(params.id)} 
        userId={userId} 
      />
    </div>
  );
} 