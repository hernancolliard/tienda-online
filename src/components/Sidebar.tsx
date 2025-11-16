'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FiHome, FiSettings, FiTag, FiLogIn, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
}

const adminLink = { name: 'Admin', href: '/admin', icon: FiSettings };

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data: Category[] = await res.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const categoryNavLinks = categories.map(category => ({
    name: category.name,
    href: `/category/${category.id}`,
    icon: FiTag,
  }));

  const baseNavLinks = [
    { name: 'Inicio', href: '/', icon: FiHome },
    ...categoryNavLinks,
  ];

  // Only show admin link if user has the 'admin' role
  const navLinks = user?.role === 'admin' ? [adminLink, ...baseNavLinks] : baseNavLinks;

  return (
    <>
      {/* Hamburger menu button for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#EAE2B7] bg-[#003049] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F77F00]"
        >
          {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#003049] text-[#EAE2B7] shadow-xl transition-all duration-300 ease-in-out z-40 flex flex-col
          ${isMobileMenuOpen ? 'w-64' : 'w-0 md:w-20 md:hover:w-64'}
          md:w-20 md:hover:w-64`}
      >
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Spacer for the hamburger icon on mobile */}
        <div className="h-16 md:hidden"></div>

        {/* Main Navigation */}
        <nav className="w-full mt-10 flex-grow">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name} className="w-full">
                  <Link href={link.href} className={`flex items-center justify-center group-hover:justify-start w-full h-16 px-6 my-2 transition-colors duration-200 relative ${isActive ? 'bg-[#F77F00] text-white' : 'hover:bg-[#004a70]'}`}>
                    <link.icon className="w-8 h-8 flex-shrink-0" />
                    <span className={`ml-4 text-lg font-medium whitespace-nowrap transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {link.name}
                    </span>
                    {isActive && (
                       <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Session Management */}
        <div className="w-full mb-4">
          {status === 'authenticated' ? (
            <div className="px-6 py-4">
              <div className="flex items-center mb-2">
                <p className={`ml-4 text-sm font-medium whitespace-nowrap truncate transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {user?.name || user?.email}
                </p>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center justify-center group-hover:justify-start w-full h-16 px-6 transition-colors duration-200 hover:bg-red-800 rounded-md">
                <FiLogOut className="w-8 h-8 flex-shrink-0" />
                <span className={`ml-4 text-lg font-medium whitespace-nowrap transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  Salir
                </span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center justify-center group-hover:justify-start w-full h-16 px-6 transition-colors duration-200 hover:bg-[#004a70] rounded-md">
              <FiLogIn className="w-8 h-8 flex-shrink-0" />
              <span className={`ml-4 text-lg font-medium whitespace-nowrap transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                Entrar
              </span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
