import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { name, image_url } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
    }

    // Verificar si la categoría ya existe
    const { rows: existing } = await db.query('SELECT id FROM categories WHERE lower(name) = lower($1)', [name.trim()]);
    if (existing.length > 0) {
      return NextResponse.json({ message: 'La categoría ya existe' }, { status: 409 });
    }

    const finalImageUrl = image_url || '/imagen-general.png'; // Usar imagen por defecto si no se provee

    const { rows } = await db.query(
      'INSERT INTO categories (name, image_url) VALUES ($1, $2) RETURNING *',
      [name.trim(), finalImageUrl]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
