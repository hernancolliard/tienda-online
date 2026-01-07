'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface InstagramPost {
  id: number;
  image_url: string;
  caption: string | null;
  post_link: string | null;
  created_at: string;
}

const InstagramManager = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newPostLink, setNewPostLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const [editingCaption, setEditingCaption] = useState('');
  const [editingPostLink, setEditingPostLink] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/instagram');
      if (!res.ok) throw new Error('Failed to fetch Instagram posts');
      const data: InstagramPost[] = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newImageUrl.trim()) return setError('La URL de la imagen es requerida.');

    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: newImageUrl, caption: newCaption, post_link: newPostLink }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo crear la publicación.');
      }
      await fetchPosts();
      setNewImageUrl('');
      setNewCaption('');
      setNewPostLink('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) return;
    try {
      const res = await fetch(`/api/instagram/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      await fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleEdit = (post: InstagramPost) => {
    setEditingPostId(post.id);
    setEditingImageUrl(post.image_url);
    setEditingCaption(post.caption || '');
    setEditingPostLink(post.post_link || '');
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingImageUrl('');
    setEditingCaption('');
    setEditingPostLink('');
  };

  const handleSaveEdit = async (id: number) => {
    setError(null);
    if (!editingImageUrl.trim()) return setError('La URL de la imagen es requerida.');

    try {
      const res = await fetch(`/api/instagram/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: editingImageUrl, caption: editingCaption, post_link: editingPostLink }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo actualizar la publicación.');
      }
      await fetchPosts();
      handleCancelEdit();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando publicaciones...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-component-bg rounded-lg shadow-xl mt-6 text-primary-text">
      <h2 className="text-xl font-semibold mb-4">Gestionar Publicaciones de Instagram (Simulado)</h2>
      
      {error && <p className="text-red mb-4">{error}</p>}

      <form onSubmit={handleAddPost} className="mb-6 space-y-4">
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="URL de la imagen"
          className="w-full p-2 border rounded-md bg-background text-primary-text"
          required
        />
        <input
          type="text"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          placeholder="Descripción (opcional)"
          className="w-full p-2 border rounded-md bg-background text-primary-text"
        />
        <input
          type="text"
          value={newPostLink}
          onChange={(e) => setNewPostLink(e.target.value)}
          placeholder="Enlace a la publicación original (opcional)"
          className="w-full p-2 border rounded-md bg-background text-primary-text"
        />
        <button type="submit" className="w-full px-4 py-2 bg-primary-text text-white rounded-md hover:opacity-90">Añadir Publicación</button>
      </form>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Publicaciones Existentes:</h3>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                {editingPostId === post.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editingImageUrl}
                      onChange={(e) => setEditingImageUrl(e.target.value)}
                      className="p-1 border rounded-md bg-background text-primary-text"
                      placeholder="URL de la imagen"
                      required
                    />
                    <textarea
                      value={editingCaption}
                      onChange={(e) => setEditingCaption(e.target.value)}
                      className="p-1 border rounded-md bg-background text-primary-text"
                      placeholder="Descripción"
                      rows={2}
                    />
                    <input
                      type="text"
                      value={editingPostLink}
                      onChange={(e) => setEditingPostLink(e.target.value)}
                      className="p-1 border rounded-md bg-background text-primary-text"
                      placeholder="Enlace"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleSaveEdit(post.id)} className="px-3 py-1 bg-primary-text text-white rounded-md text-sm hover:opacity-90">Guardar</button>
                      <button onClick={handleCancelEdit} className="px-3 py-1 bg-gray-300 text-primary-text rounded-md text-sm hover:bg-gray-400">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full h-48 mb-2">
                      <Image src={post.image_url} alt={post.caption || 'Instagram post'} fill className="object-cover rounded-md" />
                    </div>
                    {post.caption && <p className="text-sm text-gray-700 mb-2">{post.caption}</p>}
                    {post.post_link && (
                      <Link href={post.post_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        Ver publicación original
                      </Link>
                    )}
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => handleEdit(post)} className="text-sm text-primary-text hover:opacity-80">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="text-sm text-red hover:opacity-80">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : <p>No hay publicaciones de Instagram.</p>}
      </div>
    </div>
  );
};

export default InstagramManager;
