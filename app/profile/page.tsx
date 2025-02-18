"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserProfile {
  user_id: number;
  user_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile?user_id=1');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setMessage('Erro ao carregar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      setMessage('');
      
      const dataToSend = {
        user_id: profile.user_id,
        avatar_url: profile.avatar_url?.substring(0, 2000) || null,
        bio: profile.bio || null,
        preferences: profile.preferences || null
      };

      console.log('Enviando dados:', dataToSend);

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error + (data.details ? `: ${data.details}` : ''));
      }

      setMessage('Perfil atualizado com sucesso!');
      setProfile(data.profile);
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/wishlist')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {profile && (
        <form onSubmit={updateProfile} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome</label>
            <Input value={profile.user_name} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input value={profile.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL do Avatar</label>
            <Input
              value={profile.avatar_url || ''}
              onChange={e => setProfile({...profile, avatar_url: e.target.value})}
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Biografia</label>
            <Textarea
              value={profile.bio || ''}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              placeholder="Conte um pouco sobre você..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      )}
    </div>
  );
} 