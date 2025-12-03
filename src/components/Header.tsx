'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <header className="bg-component-bg text-primary-text shadow-md fixed top-0 left-0 right-0 z-50 header-layout">
        <div className="w-full px-4 py-3 flex justify-between items-center">
          {/* Left: Hamburger menu button for mobile */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-background bg-primary-text rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
            >
              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>

          {/* Center: Logo (adjusted for mobile) */}
          <div className="flex-shrink-0 flex-grow md:flex-grow-0 flex justify-center md:justify-start">
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

          {/* Search Bar (visible on all screens, adjusted for mobile) */}
          <form onSubmit={handleSearch} className="flex-grow max-w-xl mx-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full p-2 pl-10 text-sm text-primary-text rounded-lg bg-background focus:ring-orange focus:border-orange"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-primary-text" />
              </button>
            </div>
          </form>

          {/* Right: Cart */}
          <div className="flex-shrink-0">
            <Link href="/cart" className="relative p-2 block rounded-full hover:bg-black/10">
              <ShoppingCartIcon className="h-7 w-7" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red text-white text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </>
  );
}

