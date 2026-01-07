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
    const { is_approved } = await req.json();

    if (typeof is_approved !== 'boolean') {
      return NextResponse.json({ message: 'El estado de aprobación es requerido' }, { status: 400 });
    }

    const { rows } = await db.query(
      'UPDATE testimonials SET is_approved = $1 WHERE id = $2 RETURNING *',
      [is_approved, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Testimonio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(`Error updating testimonial ${params.id}:`, error);
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
    const { rowCount } = await db.query('DELETE FROM testimonials WHERE id = $1', [id]);

    if (rowCount === 0) {
      return NextResponse.json({ message: 'Testimonio no encontrado' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting testimonial ${params.id}:`, error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
