'use client';

import { useState, Fragment } from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(product: Product) {
    setSelectedProduct(product);
    setIsOpen(true);
  }

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
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={closeModal}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative aspect-square">
                          <Image
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            fill
                            className="object-cover rounded-lg"
                          />
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
                            {selectedProduct.talle && selectedProduct.talle.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold" style={{ color: '#D62828' }}>Talles disponibles:</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedProduct.talle.map(t => (
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
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
