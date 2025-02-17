"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewWishlistItem() {
  const router = useRouter();
  const userId = 1; // Temporário - deve vir da autenticação

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    priority: 'medium',
    url: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: userId,
          purchase_status_id: 1, // Status "Não Comprado"
          price: formData.price ? parseFloat(formData.price) : null
        }),
      });

      if (response.ok) {
        router.push('/wishlist');
      }
    } catch (error) {
      console.error('Erro ao criar item:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Novo Item na Lista de Desejos</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preço</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prioridade</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL da Imagem</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push('/wishlist')}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Criar Item
          </button>
        </div>
      </form>
    </div>
  );
} 