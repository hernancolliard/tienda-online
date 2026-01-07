'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const TestimonialForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    if (rating === 0 || comment.trim() === '') {
      setStatus('error');
      setMessage('Por favor, completa la calificación y el comentario.');
      return;
    }

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al enviar el testimonio.');
      }

      setStatus('success');
      setMessage('¡Gracias por tu testimonio!');
      setComment('');
      setRating(0);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  };
  
  if (status === 'success') {
    return (
        <div className="text-center p-4 border-t-2 border-dashed border-gray-300 mt-8">
            <p className="text-green-600 font-semibold">{message}</p>
        </div>
    );
  }

  return (
    <div className="border-t-2 border-dashed border-gray-300 mt-8 pt-6">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">¡Cuéntanos qué te pareció!</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-8 w-8 cursor-pointer ${
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe tu opinión aquí..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mango"
          rows={4}
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          className="w-full mt-4 px-6 py-2 bg-primary-text text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar Testimonio'}
        </button>
        {status === 'error' && <p className="text-red-500 text-sm mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default TestimonialForm;
