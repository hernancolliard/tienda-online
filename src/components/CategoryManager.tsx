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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (!res.ok) {
        throw new Error('No se pudieron cargar las categorías.');
      }
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
    if (!newCategoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }
    
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

      // Recargar la lista de categorías para mostrar la nueva
      await fetchCategories();
      setNewCategoryName('');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
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
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Añadir
        </button>
      </form>

      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Categorías Existentes:</h3>
          {categories.length > 0 ? (
            <ul className="list-disc list-inside">
              {categories.map(category => (
                <li key={category.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                  <span>{category.name}</span>
                  {/* TODO: Implementar botones de editar/eliminar */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay categorías definidas.</p>
          )}
        </div>
      )}
    </div>
  );
}
