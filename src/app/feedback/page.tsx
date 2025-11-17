'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === 'success') {
      clearCart();
    }
  }, [status, clearCart]);

  const feedback = {
    success: {
      icon: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />,
      title: '¡Pago exitoso!',
      message: 'Gracias por tu compra. Hemos recibido tu pago y estamos procesando tu pedido.',
    },
    failure: {
      icon: <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />,
      title: 'Pago fallido',
      message: 'Hubo un problema al procesar tu pago. Por favor, intenta de nuevo o contacta a soporte.',
    },
    pending: {
      icon: <ExclamationCircleIcon className="w-16 h-16 text-yellow-500 mx-auto" />,
      title: 'Pago pendiente',
      message: 'Tu pago está pendiente de confirmación. Te notificaremos una vez que se complete.',
    },
  };

  const currentFeedback = status ? feedback[status as keyof typeof feedback] : null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <div className="text-center bg-white bg-opacity-80 p-10 rounded-lg shadow-xl max-w-lg">
        {currentFeedback ? (
          <>
            {currentFeedback.icon}
            <h1 className="text-3xl font-bold mt-4 text-gray-900">{currentFeedback.title}</h1>
            <p className="text-gray-700 mt-2">{currentFeedback.message}</p>
          </>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">Procesando tu información...</h1>
        )}
        <Link href="/" className="mt-8 inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
