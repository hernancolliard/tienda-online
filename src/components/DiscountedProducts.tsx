import ProductList from '@/components/ProductList';
import { Product } from '@/types/product';

async function getDiscountedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?discounted=true`, {
      cache: 'no-store', // Always fetch the latest
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch discounted products');
    }
    
    const products: Product[] = await res.json();
    return products.slice(0, 8); // Get up to 8 discounted products
  } catch (error) {
    console.error('FETCH_DISCOUNTED_PRODUCTS_ERROR:', error);
    return [];
  }
}

const DiscountedProducts = async () => {
  const discountedProducts = await getDiscountedProducts();

  if (discountedProducts.length === 0) {
    return null; // Don't render the section if there are no discounted products
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary-text">
          Productos con Descuento
        </h2>
        <ProductList products={discountedProducts} />
      </div>
    </section>
  );
};

export default DiscountedProducts;
