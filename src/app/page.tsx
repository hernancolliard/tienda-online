import ProductList from '@/components/ProductList';
import { db } from '@/lib/db';
import { Product } from '@/types/product';
import { promises as fs } from 'fs';
import path from 'path';

// This is a Server Component, so we can fetch data directly.
async function getProducts(): Promise<Product[]> {
  try {
    // We add a random order to simulate a "featured" list.
    // In a real app, you might have a 'featured' flag.
    const { rows } = await db.query('SELECT * FROM products ORDER BY RANDOM()');
    // The database driver returns decimal types as strings, so we need to parse them.
    return rows.map(product => ({
      ...product,
      price: parseFloat(product.price),
    }));
  } catch (error) {
    console.error('DATABASE_FETCH_ERROR:', error);
    // Return an empty array on error to prevent the page from crashing.
    // The real error will be visible in the Vercel logs.
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-10" style={{ color: '#003049' }}>
        Ofertas Destacadas
      </h2>
      <ProductList products={products} />
    </div>
  );
}
