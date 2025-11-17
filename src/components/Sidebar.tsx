'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FiHome, FiSettings, FiTag, FiLogIn, FiLogOut } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
}

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const adminLink = { name: 'Admin', href: '/admin', icon: FiSettings };

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [categories, setCategories] = useState<Category[]>([]);

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
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside
        className={`group fixed top-0 left-0 h-screen bg-[#003049] text-[#EAE2B7] shadow-xl transition-all duration-300 ease-in-out z-[999] flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          md:translate-x-0 md:w-20 md:hover:w-64`}
      >

        {/* Main Navigation */}
        <nav className="w-full mt-10 flex-grow">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name} className="w-full">
                  <Link href={link.href} className={`flex items-center group-hover:justify-start w-full h-16 my-2 transition-colors duration-200 relative md:pl-6 group-hover:px-6 ${isActive ? 'bg-[#F77F00] text-white' : 'hover:bg-[#004a70]'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    <link.icon className="w-8 h-8 flex-shrink-0" />
                    <span className={`ml-4 text-lg font-medium whitespace-nowrap transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'} md:group-hover:opacity-100`}>
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
            <div className="py-4 group-hover:px-6">
              <div className="flex items-center mb-2">
                <p className={`ml-4 text-sm font-medium whitespace-nowrap truncate transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'} md:group-hover:opacity-100`}>
                  {user?.name || user?.email}
                </p>
              </div>
              <button onClick={() => { signOut({ callbackUrl: '/' }); setIsMobileMenuOpen(false); }} className="flex items-center group-hover:justify-start w-full h-16 transition-colors duration-200 hover:bg-red-800 rounded-md md:pl-6">
                <FiLogOut className="w-8 h-8 flex-shrink-0" />
                <span className={`ml-4 text-lg font-medium whitespace-nowrap transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'} md:group-hover:opacity-100`}>
                  Salir
                </span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center group-hover:justify-start w-full h-16 transition-colors duration-200 hover:bg-[#004a70] rounded-md group-hover:px-6 md:pl-6" onClick={() => setIsMobileMenuOpen(false)}>
              <FiLogIn className="w-8 h-8 flex-shrink-0" />
              <span className={`ml-4 text-lg font-medium whitespace-nowrap transition-opacity duration-200 delay-100 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'} md:group-hover:opacity-100`}>
                Entrar
              </span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
