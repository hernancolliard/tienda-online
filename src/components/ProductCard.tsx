import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-transform duration-300 ease-in-out hover:-translate-y-2"
    >
      <div className="w-full h-full rounded-xl shadow-lg bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg p-4 flex space-x-4">
        {/* Image Container */}
        <div className="relative w-1/3 h-auto aspect-square flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Content Container */}
        <div className="w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#003049' }}>
              {product.name}
            </h3>
            
            {product.talle && product.talle.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-semibold" style={{ color: '#D62828' }}>Talles:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.talle.map(t => (
                    <span key={t} className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#EAE2B7', color: '#003049' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-right mt-4">
            <span className="text-2xl font-extrabold" style={{ color: '#F77F00' }}>
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
