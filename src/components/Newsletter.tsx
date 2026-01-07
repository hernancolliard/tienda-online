'use client';

import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Algo salió mal.');
      }

      setStatus('success');
      setMessage(data.message);
      setEmail('');

    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'No se pudo completar la suscripción.');
    }
  };

  return (
    <section className="bg-primary-text py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">
          Recibí ofertas y lanzamientos exclusivos
        </h2>
        <p className="mb-8 max-w-xl mx-auto">
          Suscribite a nuestro newsletter y sé el primero en enterarte de todo.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu dirección de email"
            className="w-full p-3 rounded-l-lg border-0 text-primary-text focus:ring-2 focus:ring-mango"
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="bg-orange text-white font-bold py-3 px-6 rounded-r-lg hover:bg-mango transition-colors disabled:opacity-70"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
