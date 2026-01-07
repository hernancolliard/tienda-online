'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image component

interface Category {
  id: number;
  name: string;
  image_url: string; // Add image_url to the interface
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState(''); // State for new image URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State para la edición
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryImageUrl, setEditingCategoryImageUrl] = useState(''); // State for editing image URL

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('No se pudieron cargar las categorías.');
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newCategoryName.trim()) return setError('El nombre no puede estar vacío.');
    
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, image_url: newCategoryImageUrl }), // Send image_url
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo crear la categoría.');
      }
      await fetchCategories();
      setNewCategoryName('');
      setNewCategoryImageUrl(''); // Clear image URL field
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo eliminar la categoría.');
      }
      await fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingCategoryImageUrl(category.image_url); // Set image URL for editing
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingCategoryImageUrl('');
  };

  const handleSaveEdit = async (id: number) => {
    setError(null);
    if (!editingCategoryName.trim()) return setError('El nombre no puede estar vacío.');

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategoryName, image_url: editingCategoryImageUrl }), // Send image_url
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo actualizar la categoría.');
      }
      await fetchCategories();
      handleCancelEdit();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-component-bg rounded-lg shadow-xl mt-6 text-primary-text">
      <h2 className="text-xl font-semibold mb-4">Gestionar Categorías</h2>
      
      {error && <p className="text-red mb-4">{error}</p>}

      <form onSubmit={handleAddCategory} className="mb-6 space-y-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="w-full p-2 border rounded-md bg-background text-primary-text"
        />
        <input
          type="text"
          value={newCategoryImageUrl}
          onChange={(e) => setNewCategoryImageUrl(e.target.value)}
          placeholder="URL de la imagen de la categoría (opcional)"
          className="w-full p-2 border rounded-md bg-background text-primary-text"
        />
        <button type="submit" className="w-full px-4 py-2 bg-primary-text text-white rounded-md hover:opacity-90">Añadir Categoría</button>
      </form>

      {loading ? <p>Cargando...</p> : (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Categorías Existentes:</h3>
          {categories.length > 0 ? (
            <ul>
              {categories.map(category => (
                <li key={category.id} className="flex justify-between items-center p-2 rounded-md hover:bg-black/10">
                  <div className="flex items-center gap-2 flex-grow">
                    {editingCategoryId === category.id ? (
                      <div className="flex flex-col flex-grow">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-grow p-1 border rounded-md bg-background text-primary-text mb-1"
                        />
                        <input
                          type="text"
                          value={editingCategoryImageUrl}
                          onChange={(e) => setEditingCategoryImageUrl(e.target.value)}
                          className="flex-grow p-1 border rounded-md bg-background text-primary-text"
                          placeholder="URL de la imagen"
                        />
                      </div>
                    ) : (
                      <>
                        {category.image_url && (
                            <Image src={category.image_url} alt={category.name} width={40} height={40} className="rounded-md object-cover" />
                        )}
                        <span>{category.name}</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingCategoryId === category.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(category.id)} className="text-sm text-primary-text hover:opacity-80">Guardar</button>
                        <button onClick={handleCancelEdit} className="text-sm text-primary-text/70 hover:text-primary-text">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(category)} className="text-sm text-primary-text hover:opacity-80">Editar</button>
                        <button onClick={() => handleDelete(category.id)} className="text-sm text-red hover:opacity-80">Eliminar</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : <p>No hay categorías definidas.</p>}
        </div>
      )}
    </div>
  );
}
