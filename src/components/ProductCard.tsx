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
    <div
      onClick={onClick}
      className="relative aspect-square w-full overflow-hidden group cursor-pointer"
    >
      {/* Image Background */}
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
      
      {/* Overlay and Content on Hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300"></div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <h3 className="text-lg font-bold">
          {product.name}
        </h3>
        <p className="text-xl font-extrabold mt-1">
          ${product.price.toFixed(2)}
        </p>
        <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <button 
              className={`px-3 py-1 text-xs font-medium rounded ${isAdded ? 'bg-green-600' : 'bg-white text-black hover:bg-gray-200'}`}
              onClick={handleAddToCart}
              disabled={isAdded}
          >
              {isAdded ? '¡Añadido!' : 'Agregar'}
          </button>
          <button 
              className="px-3 py-1 text-xs font-medium rounded bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleBuyNow}
          >
              Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
