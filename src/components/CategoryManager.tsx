'use client'

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State para la edición
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

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
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo crear la categoría.');
      }
      await fetchCategories();
      setNewCategoryName('');
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
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleSaveEdit = async (id: number) => {
    setError(null);
    if (!editingCategoryName.trim()) return setError('El nombre no puede estar vacío.');

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategoryName }),
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
    <div className="p-6 bg-white rounded-lg shadow-md mt-6 text-gray-900">
      <h2 className="text-xl font-semibold mb-4">Gestionar Categorías</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleAddCategory} className="mb-6 flex gap-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-grow p-2 border rounded-md"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Añadir</button>
      </form>

      {loading ? <p>Cargando...</p> : (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Categorías Existentes:</h3>
          {categories.length > 0 ? (
            <ul>
              {categories.map(category => (
                <li key={category.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                  {editingCategoryId === category.id ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="flex-grow p-1 border rounded-md"
                    />
                  ) : (
                    <span>{category.name}</span>
                  )}
                  <div className="flex gap-2">
                    {editingCategoryId === category.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(category.id)} className="text-sm text-green-600 hover:text-green-800">Guardar</button>
                        <button onClick={handleCancelEdit} className="text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(category)} className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                        <button onClick={() => handleDelete(category.id)} className="text-sm text-red-600 hover:text-red-800">Eliminar</button>
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
