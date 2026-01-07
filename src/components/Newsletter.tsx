'use client';

import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual newsletter subscription logic
    // For now, just show a success message.
    if (email && email.includes('@')) {
      setMessage(`¡Gracias por suscribirte, ${email}! (Funcionalidad en desarrollo)`);
      setEmail('');
    } else {
      setMessage('Por favor, introduce un email válido.');
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
          />
          <button
            type="submit"
            className="bg-orange text-white font-bold py-3 px-6 rounded-r-lg hover:bg-mango transition-colors"
          >
            Suscribirme
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
