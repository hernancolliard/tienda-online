'use client'

import { useState, useEffect, FormEvent } from 'react';

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

const initialFormState = {
  name: '',
  description: '',
  price: '',
  images: '', // Comma-separated URLs
  category_id: '',
  stock_quantity: '0',
  sizes: '', // Comma-separated sizes
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('No se pudieron cargar los datos.');
      }
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const newProduct = {
      ...formState,
      price: parseFloat(formState.price),
      stock_quantity: parseInt(formState.stock_quantity, 10),
      category_id: parseInt(formState.category_id, 10),
      images: formState.images.split(',').map(url => url.trim()).filter(url => url),
      sizes: formState.sizes.split(',').map(s => s.trim()).filter(s => s),
    };

    if (!newProduct.name || !newProduct.price || !newProduct.category_id) {
      return setError('Nombre, precio y categoría son requeridos.');
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo crear el producto.');
      }

      await fetchData(); // Recargar datos
      setIsModalOpen(false); // Cerrar modal
      setFormState(initialFormState); // Resetear formulario
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const openModal = () => {
    setError(null);
    setFormState(initialFormState);
    setIsModalOpen(true);
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestionar Productos</h2>
        <button onClick={openModal} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Añadir Producto
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        {loading ? <p>Cargando...</p> : (
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
                  <td className="py-2 px-4 border-b text-center">{/* Acciones */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Añadir Nuevo Producto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
                <input id="name" name="name" type="text" value={formState.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Descripción</label>
                <textarea id="description" name="description" value={formState.description} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Precio</label>
                <input id="price" name="price" type="number" step="0.01" value={formState.price} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium mb-1">Categoría</label>
                <select id="category_id" name="category_id" value={formState.category_id} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium mb-1">Cantidad (Stock)</label>
                <input id="stock_quantity" name="stock_quantity" type="number" value={formState.stock_quantity} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="sizes" className="block text-sm font-medium mb-1">Talles (separados por coma)</label>
                <input id="sizes" name="sizes" type="text" value={formState.sizes} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="images" className="block text-sm font-medium mb-1">URLs de Imágenes (separadas por coma)</label>
                <textarea id="images" name="images" value={formState.images} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
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
