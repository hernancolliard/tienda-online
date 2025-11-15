import { Pool } from 'pg';

// Crea un "pool" de conexiones.
// Usará la variable de entorno POSTGRES_URL (proveída por Vercel) si existe,
// de lo contrario, usará DATABASE_URL (para desarrollo local).
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones a bases de datos serverless como Vercel o Render
  }
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
