import ProductList from '@/components/ProductList';
import { Product } from '@/types/product';

async function getNewestProducts(): Promise<Product[]> {
  try {
    // The default API endpoint sorts by newest first.
    // We fetch all and slice, but a limit could be added to the API.
    const res = await fetch(`/api/products`, {
      cache: 'no-store', // Always fetch the latest
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products: Product[] = await res.json();
    return products.slice(0, 4); // Get the 4 newest products
  } catch (error) {
    console.error('FETCH_NEW_ARRIVALS_ERROR:', error);
    return [];
  }
}

const NewArrivals = async () => {
  const newProducts = await getNewestProducts();

  if (newProducts.length === 0) {
    return null; // Don't render the section if there are no products
  }

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary-text">
          Nuevos Ingresos
        </h2>
        <ProductList products={newProducts} />
      </div>
    </section>
  );
};

export default NewArrivals;
