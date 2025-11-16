import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const featuredOnly = searchParams.get('featured') === 'true';
    const categoryId = searchParams.get('category_id');

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const queryParams = [];
    const conditions = [];

    if (featuredOnly) {
      conditions.push('p.is_featured = true');
    }

    if (categoryId) {
      conditions.push('p.category_id = $1');
      queryParams.push(categoryId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    const { rows } = await db.query(query, queryParams);

    // Log the images field of the first product for debugging
    if (rows.length > 0) {
      console.log('First product images field:', rows[0].images);
    }

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
    console.log('Received request body:', JSON.stringify(body, null, 2)); // Log para depuración

    const {
      name,
      description,
      price,
      images,
      category_id,
      stock_quantity,
      sizes,
    } = body;

    console.log('Parsed images from body:', images); // Log para depuración

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
