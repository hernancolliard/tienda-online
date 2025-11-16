'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSettings, FiTag } from 'react-icons/fi';

const navLinks = [
  { name: 'Inicio', href: '/', icon: FiHome },
  { name: 'Admin', href: '/admin', icon: FiSettings },
  { name: 'Categoría 1', href: '/category/1', icon: FiTag },
  { name: 'Categoría 2', href: '/category/2', icon: FiTag },
  { name: 'Categoría 3', href: '/category/3', icon: FiTag },
  { name: 'Categoría 4', href: '/category/4', icon: FiTag },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="group fixed top-0 left-0 h-screen w-20 hover:w-64 bg-[#003049] text-[#EAE2B7] shadow-xl transition-all duration-300 ease-in-out z-50"
    >
      <div className="flex flex-col items-center mt-10">
        <nav className="w-full mt-10">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name} className="w-full">
                  <Link href={link.href} className={`flex items-center justify-center group-hover:justify-start w-full h-16 px-6 my-2 transition-colors duration-200 relative ${isActive ? 'bg-[#F77F00] text-white' : 'hover:bg-[#004a70]'}`}>
                    <link.icon className="w-8 h-8 flex-shrink-0" />
                    <span className="ml-4 text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">
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
      </div>
    </aside>
  );
}
