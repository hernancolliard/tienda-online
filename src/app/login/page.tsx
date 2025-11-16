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
      <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-70 rounded-xl shadow-lg backdrop-filter backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-[#003049]">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[#003049]">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F77F00]"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[#003049]">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F77F00]"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-[#003049] rounded-md hover:bg-[#004a70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F77F00] transition-colors duration-300">
              Entrar
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-[#F77F00] hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
