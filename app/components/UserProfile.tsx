'use client';
import { useState, useEffect } from 'react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  birth_date?: string;
}

interface UserProfileProps {
  userId: number;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    avatar_url: '',
    bio: '',
    birth_date: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile?user_id=${userId}`);
      const data = await response.json();
      setProfile(data);
      setFormData({
        avatar_url: data.avatar_url || '',
        bio: data.bio || '',
        birth_date: data.birth_date || ''
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          ...formData
        }),
      });

      if (response.ok) {
        setEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  if (!profile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-32 h-32 rounded-full mx-auto"
          />
        )}
        
        <div className="text-center">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>

        {editing ? (
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Avatar URL</label>
              <input
                type="text"
                value={formData.avatar_url}
                onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Data de Nascimento</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {profile.bio && <p className="text-gray-700">{profile.bio}</p>}
            {profile.birth_date && (
              <p className="text-sm text-gray-600">
                Nascimento: {new Date(profile.birth_date).toLocaleDateString()}
              </p>
            )}
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Editar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 