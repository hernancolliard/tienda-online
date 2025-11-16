import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

import { randomUUID } from 'crypto';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validar que los datos necesarios están presentes
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nombre, email y contraseña son requeridos.' }, { status: 400 });
    }

    // Comprobar si el usuario ya existe
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ message: 'El email ya está en uso.' }, { status: 409 });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generar ID de usuario
    const userId = randomUUID();

    // Crear el nuevo usuario
    const { rows: newUser } = await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [userId, name, email, hashedPassword, 'user']
    );

    return NextResponse.json(newUser[0], { status: 201 });

  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ message: 'Ha ocurrido un error en el servidor.' }, { status: 500 });
  }
}
