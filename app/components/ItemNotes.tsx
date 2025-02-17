'use client';
import { useState, useEffect } from 'react';

interface Note {
  id: number;
  user_id: number;
  item_id: number;
  note: string;
  created_at: string;
  user_name?: string;
}

interface ItemNotesProps {
  itemId: number;
  userId: number;
}

export default function ItemNotes({ itemId, userId }: ItemNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Carregar notas
  useEffect(() => {
    fetchNotes();
  }, [itemId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/notes?item_id=${itemId}`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    }
  };

  // Adicionar nota
  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, item_id: itemId, note: newNote }),
      });

      if (response.ok) {
        setNewNote('');
        fetchNotes();
      }
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
    }
  };

  // Atualizar nota
  const updateNote = async (note: Note) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: note.id, 
          user_id: userId, 
          note: note.note 
        }),
      });

      if (response.ok) {
        setEditingNote(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
    }
  };

  // Deletar nota
  const deleteNote = async (noteId: number) => {
    try {
      const response = await fetch(`/api/notes?id=${noteId}&user_id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Notas</h3>
      
      {/* Formulário para adicionar nota */}
      <form onSubmit={addNote} className="space-y-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Adicione uma nota..."
          className="w-full p-2 border rounded"
          required
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar Nota
        </button>
      </form>

      {/* Lista de notas */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 border rounded">
            {editingNote?.id === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editingNote.note}
                  onChange={(e) => setEditingNote({...editingNote, note: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <div className="space-x-2">
                  <button
                    onClick={() => updateNote(editingNote)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingNote(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-2">{note.note}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Por: {note.user_name}</span>
                  <span>{new Date(note.created_at).toLocaleString()}</span>
                </div>
                {note.user_id === userId && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 