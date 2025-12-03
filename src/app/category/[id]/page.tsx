import ProductList from '@/components/ProductList';
import { Product } from '@/types/product';

interface CategoryPageProps {
  params: {
    id: string; // This is the category ID
  };
}

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category_id=${categoryId}`, {
    cache: 'no-store', // Ensure fresh data
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const products = await getProductsByCategory(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-text mb-6">Productos en Categoría</h1>
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p className="text-primary-text">No hay productos en esta categoría.</p>
      )}
    </div>
  );
}
