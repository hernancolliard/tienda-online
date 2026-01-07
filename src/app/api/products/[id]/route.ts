import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Handler para actualizar un producto
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const {
      name,
      description,
      price,
      images,
      category_id,
      stock_quantity,
      sizes,
      is_featured,
      discount_percentage,
    } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json({ message: 'Nombre, precio y categoría son requeridos' }, { status: 400 });
    }

    const { rows } = await db.query(
      `UPDATE products SET 
        name = $1, 
        description = $2, 
        price = $3, 
        images = $4, 
        category_id = $5, 
        stock_quantity = $6, 
        sizes = $7,
        is_featured = $8,
        discount_percentage = $9
       WHERE id = $10 
       RETURNING *`,
      [name, description, parseFloat(price), images, parseInt(category_id, 10), parseInt(stock_quantity, 10), sizes, is_featured, parseInt(discount_percentage, 10) || 0, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// Handler para eliminar un producto
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { rowCount } = await db.query('DELETE FROM products WHERE id = $1', [id]);

    if (rowCount === 0) {
      return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
