'use client';

import { useState, FormEvent } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Algo salió mal.');
      }

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-component-bg rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-primary-text">Recuperar Contraseña</h2>
        <p className="text-center text-primary-text">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-primary-text sr-only">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-primary-text/20 rounded-md shadow-sm bg-background text-primary-text placeholder-primary-text/50 focus:outline-none focus:ring-orange focus:border-orange"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-text hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace'}
            </button>
          </div>
        </form>
        {message && <p className="text-primary-text font-bold text-center">{message}</p>}
        {error && <p className="text-red text-center">{error}</p>}
      </div>
    </div>
  );
}
