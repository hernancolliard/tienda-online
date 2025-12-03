'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push('/'); // Redirigir a la página de inicio tras el éxito
        router.refresh(); // Para actualizar el estado de la sesión en el servidor
      } else {
        setError('Email o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Ha ocurrido un error de red.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-component-bg rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-primary-text">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-primary-text">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-primary-text bg-background border border-primary-text/20 rounded-md focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-primary-text">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-primary-text bg-background border border-primary-text/20 rounded-md focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
          {error && <p className="text-sm text-red text-center">{error}</p>}
          <div>
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-primary-text rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange transition-colors duration-300">
              Entrar
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-primary-text">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-orange hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
