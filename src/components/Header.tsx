'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon, ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
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
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/about', label: 'Nosotros' },
  ];

  if (session?.user?.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin' });
  }

  return (
    <header className="bg-component-bg text-primary-text shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/chipichipi.jpg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="hidden sm:block font-bold text-lg">Mi Tienda</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation & Search */}
        <div className="hidden md:flex flex-grow items-center justify-center gap-8">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-orange">
                {link.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={handleSearch} className="flex-grow max-w-xs">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full p-2 pl-10 text-sm rounded-lg bg-background focus:ring-mango focus:border-mango"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Icons & Auth */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-black/10">
            <ShoppingCartIcon className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red text-white text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {session ? (
            <button onClick={() => signOut()} className="hidden md:block text-sm font-medium hover:text-orange">
              Salir
            </button>
          ) : (
            <Link href="/login" className="hidden md:block p-2 rounded-full hover:bg-black/10">
              <UserCircleIcon className="h-6 w-6" />
            </Link>
          )}

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-component-bg shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[150%]'
        }`}
      >
        <div className="p-4">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full p-2 pl-4 text-sm rounded-lg bg-background focus:ring-mango focus:border-mango"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-center font-medium hover:text-orange">
                {link.label}
              </Link>
            ))}
            <div className="border-t border-background pt-4 mt-2">
              {session ? (
                <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full py-2 text-center font-medium hover:text-orange">
                  Salir
                </button>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center font-medium hover:text-orange">
                  Ingresar
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

