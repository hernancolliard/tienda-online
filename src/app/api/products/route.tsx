import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Resend } from 'resend';
import { NewProductEmail } from '@/components/emails/NewProductEmail';
import React from 'react';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const featuredOnly = searchParams.get('featured') === 'true';
    const discounted = searchParams.get('discounted') === 'true';
    const categoryId = searchParams.get('category_id');
    const searchQuery = searchParams.get('query');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const queryParams = [];
    const conditions = [];
    let paramIndex = 1;

    if (featuredOnly) {
      conditions.push('p.is_featured = true');
    }

    if (discounted) {
      conditions.push('p.discount_percentage > 0');
    }

    if (categoryId) {
      conditions.push(`p.category_id = $${paramIndex++}`);
      queryParams.push(categoryId);
    }

    if (searchQuery) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex++})`);
      queryParams.push(`%${searchQuery}%`);
    }

    if (minPrice) {
      conditions.push(`p.price >= $${paramIndex++}`);
      queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push(`p.price <= $${paramIndex++}`);
      queryParams.push(parseFloat(maxPrice));
    }

    if (size) {
      conditions.push(`$${paramIndex++} = ANY(p.sizes)`);
      queryParams.push(size);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    const { rows } = await db.query(query, queryParams);

    const processedRows = rows.map(product => {
      // Ensure price is a number
      const price = parseFloat(product.price);

      // Ensure images are valid data URIs if they are base64 strings
      const images = Array.isArray(product.images)
        ? product.images.map((img: string) => {
            // Check if it's a base64 string and doesn't already have a data URI prefix
            if (typeof img === 'string' && !img.startsWith('http') && !img.startsWith('data:')) {
              // Assuming JPEG for now, could be made more dynamic if needed
              return `data:image/jpeg;base64,${img}`;
            }
            return img;
          })
        : []; // Default to empty array if images is not an array

      return {
        ...product,
        price,
        images,
      };
    });

    return NextResponse.json(processedRows);
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
      discount_percentage,
    } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json({ message: 'Nombre, precio y categoría son requeridos' }, { status: 400 });
    }

    const { rows } = await db.query(
      `INSERT INTO products (name, description, price, images, category_id, stock_quantity, sizes, discount_percentage)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, parseFloat(price), images, parseInt(category_id, 10), parseInt(stock_quantity, 10), sizes, parseInt(discount_percentage, 10) || 0]
    );

    const newProduct = rows[0];

    // Envío de correo a suscriptores
    try {
      const { rows: subscribers } = await db.query('SELECT email FROM subscribers');
      
      if (subscribers.length > 0) {
        const emails = subscribers.map(s => s.email);
        
        console.log(`Enviando correos a ${emails.length} suscriptores.`);

        await resend.emails.send({
          from: fromEmail,
          to: emails, // Resend maneja el envío a múltiples destinatarios
          subject: '¡Nuevo producto disponible!',
          html: await render(<NewProductEmail
            productName={newProduct.name}
            productDescription={newProduct.description}
            productImage={newProduct.images && newProduct.images.length > 0 ? newProduct.images[0] : ''}
            productUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/category/${newProduct.category_id}`}
          />),
        });

        console.log('Correos de nuevo producto enviados exitosamente.');
      }
    } catch (emailError) {
      console.error('Error al enviar correos de nuevo producto:', emailError);
      // No devolvemos un error aquí para no interrumpir la respuesta principal
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
