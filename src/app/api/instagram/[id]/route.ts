import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { image_url, caption, post_link } = await req.json();

    if (!image_url || typeof image_url !== 'string' || image_url.trim().length === 0) {
      return NextResponse.json({ message: 'La URL de la imagen es requerida' }, { status: 400 });
    }

    const { rows } = await db.query(
      'UPDATE instagram_posts SET image_url = $1, caption = $2, post_link = $3 WHERE id = $4 RETURNING *',
      [image_url, caption, post_link, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Publicación de Instagram no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(`Error updating Instagram post ${params.id}:`, error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { rowCount } = await db.query('DELETE FROM instagram_posts WHERE id = $1', [id]);

    if (rowCount === 0) {
      return NextResponse.json({ message: 'Publicación de Instagram no encontrada' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting Instagram post ${params.id}:`, error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
