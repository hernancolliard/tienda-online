import ProductList from '@/components/ProductList';
import { Product } from '@/types/product';

interface SearchPageProps {
  searchParams: {
    query?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    category_id?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query, minPrice, maxPrice, size, category_id } = searchParams;

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
  if (query) url.searchParams.append('query', query);
  if (minPrice) url.searchParams.append('minPrice', minPrice);
  if (maxPrice) url.searchParams.append('maxPrice', maxPrice);
  if (size) url.searchParams.append('size', size);
  if (category_id) url.searchParams.append('category_id', category_id);

  let products: Product[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    products = await res.json();
  } catch (err: any) {
    console.error('Error fetching search results:', err);
    error = err.message || 'Failed to load search results.';
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-text">
        Resultados de búsqueda {query && `para "${query}"`}
      </h1>
      {error ? (
        <p className="text-red">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-primary-text">No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}
