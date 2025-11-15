import ProductList from '@/components/ProductList';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mi Tienda Online</h1>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestros Productos</h2>
        <ProductList />
      </main>

      <footer className="bg-white mt-8 py-4">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2025 Mi Tienda Online. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
