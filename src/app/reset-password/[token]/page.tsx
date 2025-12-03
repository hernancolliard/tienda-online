'use client';

import { useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Token no válido o ausente.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Algo salió mal.');
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push('/login');
      }, 3000); // Redirigir al login después de 3 segundos

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-component-bg rounded-lg shadow-xl text-primary-text">
        <h2 className="text-2xl font-bold text-center">Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="text-sm font-medium">Nueva Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-primary-text/20 rounded-md shadow-sm bg-background text-primary-text"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword"  className="text-sm font-medium">Confirmar Nueva Contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-primary-text/20 rounded-md shadow-sm bg-background text-primary-text"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || !!message}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-text hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
            </button>
          </div>
        </form>
        {message && <p className="text-primary-text font-bold text-center">{message}</p>}
        {error && <p className="text-red text-center">{error}</p>}
      </div>
    </div>
  );
}
