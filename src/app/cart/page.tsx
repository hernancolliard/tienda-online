'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
      });

      if (!res.ok) {
        throw new Error('Error al crear la preferencia de pago.');
      }

      const data = await res.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white">Tu Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <div className="text-center bg-white bg-opacity-70 p-8 rounded-lg shadow-lg">
          <p className="text-xl text-gray-700">Tu carrito está vacío.</p>
          <Link href="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover rounded-md" />
                </div>
                <div className="ml-4 flex-grow">
                  <h2 className="font-bold text-lg text-gray-900">{item.name}</h2>
                  <p className="text-gray-700 font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                    className="w-16 p-1 border rounded-md text-center text-gray-800"
                  />
                  <p className="font-bold text-gray-900 w-24 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg sticky top-28">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Resumen del Pedido</h2>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-700">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between font-bold text-xl text-gray-900">
                  <span>Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
              </button>
              <Link href="/" className="mt-4 inline-block text-center w-full text-blue-600 hover:underline">
                o seguir comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
