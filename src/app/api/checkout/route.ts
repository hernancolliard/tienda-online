import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartItem } from '@/context/CartContext';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export async function POST(req: NextRequest) {
  try {
    const cartItems: CartItem[] = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    }

    const preference = await new Preference(client).create({
      body: {
        items: cartItems.map(item => ({
          id: String(item.id),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'ARS', // Moneda Argentina
          picture_url: item.images[0],
          description: item.description,
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/feedback?status=success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/feedback?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/feedback?status=pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`,
      },
    });

    return NextResponse.json({ id: preference.id, init_point: preference.init_point });

  } catch (error: any) {
    console.error('Error al crear la preferencia de pago:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
