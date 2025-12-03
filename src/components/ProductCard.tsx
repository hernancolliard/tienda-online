'use client';

import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear la preferencia de pago');
      }

      const data = await res.json();
      router.push(data.init_point);
    } catch (error) {
      console.error('Error al iniciar el pago con Mercado Pago:', error);
      alert('No se pudo iniciar el proceso de pago. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-transform duration-300 ease-in-out hover:-translate-y-2"
    >
      <div className="w-full h-full rounded-xl shadow-xl bg-component-bg p-4 flex flex-col sm:flex-row sm:space-x-4">
        {/* Image Container */}
        <div className="relative w-full sm:w-1/3 h-48 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-white">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain" // Ya no es necesario rounded aquí si el padre recorta
          />
        </div>

        {/* Content Container */}
        <div className="w-full sm:w-2/3 flex flex-col justify-between mt-4 sm:mt-0">
          <div>
            <h3 className="text-lg font-bold text-primary-text">
              {product.name}
            </h3>
            
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-red">Talles:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.sizes.map(t => (
                    <span key={t} className="text-xs font-medium px-2 py-1 rounded-full bg-background text-primary-text">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-right mt-4">
            <span className="text-2xl font-extrabold text-primary-text">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button 
                className={`px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${isAdded ? 'bg-green-600' : 'bg-primary-text hover:opacity-90'}`}
                onClick={handleAddToCart}
                disabled={isAdded}
            >
                {isAdded ? '¡Añadido!' : 'Agregar al Carrito'}
            </button>
            <button 
                className="px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-text hover:opacity-90"
                onClick={handleBuyNow}
            >
                Comprar
            </button>
          </div>
        </div>
      </div>
    </button>
  );
}
