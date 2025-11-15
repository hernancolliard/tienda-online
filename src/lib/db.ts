import { Pool } from 'pg';

// Crea un "pool" de conexiones.
// Leerá los detalles de conexión de la variable de entorno DATABASE_URL.
// En desarrollo, necesitarás crear un archivo .env.local para definir esta variable.
// En producción (en Render), la configurarás en las variables de entorno de tu servicio.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para las conexiones de base de datos en Render
  }
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
