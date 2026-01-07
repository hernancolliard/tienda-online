import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const { rows } = await db.query(
      'SELECT id, image_url, caption, post_link, created_at FROM instagram_posts ORDER BY created_at DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    // Si la tabla no existe, no tratarlo como un error fatal para el GET
    if (error instanceof Error && 'code' in error && error.code === '42P01') {
      return NextResponse.json([]); // Retorna un array vacío si la tabla no existe
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { image_url, caption, post_link } = await req.json();

    if (!image_url || typeof image_url !== 'string' || image_url.trim().length === 0) {
      return NextResponse.json({ message: 'La URL de la imagen es requerida' }, { status: 400 });
    }

    const { rows } = await db.query(
      'INSERT INTO instagram_posts (image_url, caption, post_link) VALUES ($1, $2, $3) RETURNING *',
      [image_url, caption, post_link]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating Instagram post:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
