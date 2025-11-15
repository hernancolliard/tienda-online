import ProductList from '@/components/ProductList';
import { db } from '@/lib/db';
import { Product } from '@/types/product';

async function getProducts(): Promise<Product[]> {
  try {
    const { rows } = await db.query('SELECT * FROM products');
    return rows;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return []; // Devuelve un array vacío si hay un error
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <header className="bg-dark-blue/80 shadow-md backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-mango">Mi Tienda Online</h1>
          <button className="text-beige hover:text-mango">
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-mango mb-6">Nuestros Productos</h2>
        <ProductList products={products} />
      </main>

      <footer className="bg-dark-blue/80 mt-8 py-4">
        <div className="container mx-auto px-6 text-center text-beige/70">
          <p>&copy; 2025 Mi Tienda Online. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
