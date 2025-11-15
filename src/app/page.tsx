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
    if (rows.length === 0) {
      throw new Error("No products found in DB");
    }
    return rows;
  } catch (error) {
    console.error('DB fetch failed, falling back to JSON:', error);
    // In case of a DB error, fall back to the JSON file.
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
      const jsonData = await fs.readFile(filePath, 'utf8');
      return JSON.parse(jsonData);
    } catch (jsonError) {
      console.error('Failed to read fallback JSON:', jsonError);
      return [];
    }
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
