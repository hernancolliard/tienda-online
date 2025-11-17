import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { db } from '@/lib/db';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: 'Product ID es requerido' }, { status: 400 });
    }

    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    const product = rows[0];

    if (!product) {
      return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: product.id,
            title: product.name,
            currency_id: 'ARS',
            picture_url: product.images && product.images.length > 0 ? product.images[0] : '',
            description: product.description,
            category_id: product.category_id,
            quantity: Number(quantity),
            unit_price: parseFloat(product.price),
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
        },
        auto_return: 'approved',
        external_reference: productId,
      }
    });

    return NextResponse.json({ init_point: response.init_point }, { status: 200 });

  } catch (error) {
    console.error('Error al crear la preferencia de Mercado Pago:', error);
    return NextResponse.json({ message: 'Error interno del servidor al crear la preferencia de pago' }, { status: 500 });
  }
}
