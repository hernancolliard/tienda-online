'use client'

import { useState, useEffect } from 'react';

// Interfaces para los datos. Deberían coincidir con tu esquema de BD.
interface Product {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Implementar fetch a /api/products y /api/categories
        const mockProducts: Product[] = [
          { id: 1, name: 'Remera Estampada', price: 2500, category_name: 'Remeras' },
          { id: 2, name: 'Jean Clásico', price: 7500, category_name: 'Pantalones' },
        ];
        const mockCategories: Category[] = [
          { id: 1, name: 'Remeras' },
          { id: 2, name: 'Pantalones' },
        ];
        setProducts(mockProducts);
        setCategories(mockCategories);
      } catch (err) {
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para el formulario de añadir producto
    console.log('Formulario enviado');
    setIsModalOpen(false); // Cerrar modal al enviar
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestionar Productos</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Añadir Producto
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Categoría</th>
              <th className="py-2 px-4 border-b">Precio</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b text-center">{product.name}</td>
                <td className="py-2 px-4 border-b text-center">{product.category_name}</td>
                <td className="py-2 px-4 border-b text-center">${product.price}</td>
                <td className="py-2 px-4 border-b text-center">
                  {/* Botones de Editar/Eliminar */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Añadir Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-6">Añadir Nuevo Producto</h3>
            <form onSubmit={handleAddProduct}>
              {/* Campos del formulario */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" className="w-full p-2 border rounded-md" required />
              </div>
              
              {/* TODO: Añadir resto de campos: imágenes, precio, talle, cantidad, descripción, categoría */}

              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
