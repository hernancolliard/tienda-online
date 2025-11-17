'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  is_featured: boolean;
  // Incluimos todos los campos para poder reenviarlos en el PUT
  description: string;
  price: number;
  images: string[];
  category_id: number;
  stock_quantity: number;
  sizes: string[];
}

export default function FeaturedManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('No se pudieron cargar los productos.');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleFeatured = async (product: Product) => {
    const updatedProduct = { ...product, is_featured: !product.is_featured };

    // Optimistically update the UI
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === product.id ? updatedProduct : p)
    );

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Revert the optimistic update on failure
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === product.id ? product : p)
        );
        throw new Error(errorData.message || 'No se pudo actualizar el producto.');
      }
      
      // On success, refresh server-side props for other pages (like homepage)
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Gestionar Productos Destacados</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? <p>Cargando...</p> : (
        <div className="space-y-2">
          {products.map(product => (
            <div key={product.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
              <span>{product.name}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  onChange={() => handleToggleFeatured(product)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
