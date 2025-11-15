import products from '@/data/products.json';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

export default function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {(products as Product[]).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
