import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Unir con la tabla de categorías para obtener el nombre de la categoría
    const { rows } = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      images,
      category_id,
      stock_quantity,
      sizes,
    } = body;

    // Validación simple
    if (!name || !price || !category_id) {
      return NextResponse.json({ message: 'Nombre, precio y categoría son requeridos' }, { status: 400 });
    }

    const { rows } = await db.query(
      `INSERT INTO products (name, description, price, images, category_id, stock_quantity, sizes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, parseFloat(price), images, parseInt(category_id), parseInt(stock_quantity), sizes]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
