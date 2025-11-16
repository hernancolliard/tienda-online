import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Handler para actualizar una categoría
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
    }

    const { rows } = await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name.trim(), id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// Handler para eliminar una categoría
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;

    // Opcional: Verificar si hay productos asociados a esta categoría antes de borrar.
    // Por ahora, la eliminaremos directamente.

    const { rowCount } = await db.query('DELETE FROM categories WHERE id = $1', [id]);

    if (rowCount === 0) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting category:', error);
    // Podría fallar si hay una restricción de clave externa (foreign key)
    return NextResponse.json({ message: 'Error interno del servidor. Asegúrate de que no haya productos en esta categoría.' }, { status: 500 });
  }
}
