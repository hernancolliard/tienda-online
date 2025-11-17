'use client';

import { useState, Fragment } from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(product: Product) {
    setSelectedProduct(product);
    setCurrentImageIndex(0); // Reset index when opening
    setIsOpen(true);
  }

  const handleNextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProduct.images.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => openModal(product)} />
        ))}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedProduct && (
                    <>
                      <button
                        type="button"
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-20"
                        onClick={closeModal}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative aspect-square group">
                          <Image
                            src={selectedProduct.images[currentImageIndex]}
                            alt={selectedProduct.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                          {selectedProduct.images.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevImage}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ChevronLeftIcon className="h-6 w-6" />
                              </button>
                              <button
                                onClick={handleNextImage}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ChevronRightIcon className="h-6 w-6" />
                              </button>
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                                {selectedProduct.images.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                      index === currentImageIndex ? 'bg-white' : 'bg-gray-400'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <Dialog.Title
                            as="h3"
                            className="text-2xl font-bold leading-6"
                            style={{ color: '#003049' }}
                          >
                            {selectedProduct.name}
                          </Dialog.Title>
                          <div className="mt-4 flex-grow">
                            <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold" style={{ color: '#D62828' }}>Talles disponibles:</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedProduct.sizes.map(t => (
                                    <span key={t} className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#EAE2B7', color: '#003049' }}>
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="mt-6 text-right">
                            <span className="text-3xl font-extrabold" style={{ color: '#F77F00' }}>
                              ${selectedProduct.price.toFixed(2)}
                            </span>
                            <div className="mt-4 flex justify-end gap-4">
                                <button 
                                    className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                                    onClick={() => console.log('Add to cart:', selectedProduct.name)}
                                >
                                    Agregar al Carrito
                                </button>
                                <button 
                                    className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={() => console.log('Buy now:', selectedProduct.name)}
                                >
                                    Comprar Ahora
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">{selectedProduct.description}</p>
                      </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
