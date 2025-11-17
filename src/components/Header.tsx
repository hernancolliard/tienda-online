'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <header className="bg-gray-800 text-white shadow-md fixed top-0 left-0 right-0 z-30 header-layout">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/chipichipi.jpg"
              alt="Chipichipi Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow max-w-xl mx-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full p-2 pl-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Right: Cart */}
        <div className="flex-shrink-0">
          <Link href="/cart" className="relative p-2 block rounded-full hover:bg-gray-700">
            <ShoppingCartIcon className="h-7 w-7" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
