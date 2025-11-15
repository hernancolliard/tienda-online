import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border border-beige/20 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-dark-blue/40">
      <div className="relative w-full h-60">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-mango">{product.name}</h3>
        <p className="text-beige/80 mt-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-orange">${product.price}</span>
          <button className="bg-orange hover:bg-red text-dark-blue font-bold py-2 px-4 rounded">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
