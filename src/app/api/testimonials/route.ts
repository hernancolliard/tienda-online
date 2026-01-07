import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// SQL para crear la tabla (para referencia del usuario)
/*
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  user_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = req.nextUrl;
  const showAll = session?.user?.role === 'admin' && searchParams.get('approved') === 'all';

  try {
    let query = 'SELECT * FROM testimonials';
    if (!showAll) {
      query += ' WHERE is_approved = true';
    }
    query += ' ORDER BY created_at DESC';
    
    const { rows } = await db.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // Si la tabla no existe, no tratarlo como un error fatal para el GET
    if (error instanceof Error && 'code' in error && error.code === '42P01') {
      return NextResponse.json([]); // Retorna un array vacío si la tabla no existe
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { rating, comment } = await req.json();

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'La calificación (1-5) es requerida' }, { status: 400 });
    }
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ message: 'El comentario es requerido' }, { status: 400 });
    }

    const userId = session.user.id;
    const userName = session.user.name || 'Anónimo';

    // Opcional: Verificar si el usuario ya ha dejado un testimonio
    // const { rows: existing } = await db.query('SELECT id FROM testimonials WHERE user_id = $1', [userId]);
    // if (existing.length > 0) {
    //   return NextResponse.json({ message: 'Ya has enviado un testimonio' }, { status: 409 });
    // }

    const { rows } = await db.query(
      'INSERT INTO testimonials (user_id, user_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, userName, rating, comment]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
