import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Se requiere una dirección de email válida.' }, { status: 400 });
    }

    // Verificar si el email ya está suscrito
    const { rows: existing } = await db.query('SELECT id FROM subscribers WHERE email = $1', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Este email ya está suscrito.' }, { status: 409 });
    }

    // Insertar el nuevo suscriptor
    await db.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);

    return NextResponse.json({ message: '¡Gracias por suscribirte!' }, { status: 201 });
  } catch (error) {
    console.error('Error en la suscripción al newsletter:', error);
    // Manejar el caso en que la tabla no exista
    if (error instanceof Error && 'code' in error && error.code === '42P01') {
      return NextResponse.json({ message: 'La funcionalidad de suscripción no está habilitada en este momento.' }, { status: 503 });
    }
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
