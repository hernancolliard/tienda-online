'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<string>(''); // State for new image base64
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryImage, setEditingCategoryImage] = useState<string>(''); // State for editing image base64

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newCategoryName.trim()) return setError('El nombre no puede estar vacío.');
    
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, image_url: newCategoryImage }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo crear la categoría.');
      }
      await fetchCategories();
      setNewCategoryName('');
      setNewCategoryImage('');
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
    setEditingCategoryImage(category.image_url);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingCategoryImage('');
  };

  const handleSaveEdit = async (id: number) => {
    setError(null);
    if (!editingCategoryName.trim()) return setError('El nombre no puede estar vacío.');

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategoryName, image_url: editingCategoryImage }),
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
        <div>
            <label className="block text-sm font-medium mb-1">Imagen de la Categoría</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setNewCategoryImage)}
              className="w-full text-sm text-primary-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mango file:text-white hover:file:opacity-90"
            />
            {newCategoryImage && (
              <div className="mt-4">
                <Image src={newCategoryImage} alt="Previsualización" width={80} height={80} className="rounded-md object-cover" />
              </div>
            )}
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-primary-text text-white rounded-md hover:opacity-90">Añadir Categoría</button>
      </form>

      {loading ? <p>Cargando...</p> : (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Categorías Existentes:</h3>
          {categories.length > 0 ? (
            <ul>
              {categories.map(category => (
                <li key={category.id} className="flex justify-between items-center p-2 rounded-md hover:bg-black/10">
                  <div className="flex items-center gap-4 flex-grow">
                    {editingCategoryId === category.id ? (
                      <div className="flex flex-col flex-grow gap-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-grow p-1 border rounded-md bg-background text-primary-text"
                        />
                        <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, setEditingCategoryImage)}
                              className="w-full text-sm text-primary-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mango file:text-white hover:file:opacity-90"
                            />
                            {editingCategoryImage && (
                              <div className="mt-2">
                                <Image src={editingCategoryImage} alt="Previsualización" width={60} height={60} className="rounded-md object-cover" />
                              </div>
                            )}
                        </div>
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
