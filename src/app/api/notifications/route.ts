import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const notification = await req.json();
    console.log('Notificación de Mercado Pago recibida:');
    console.log(JSON.stringify(notification, null, 2));

    // Aquí iría la lógica para manejar la notificación,
    // como verificar el pago y actualizar el estado del pedido en la base de datos.
    
    // Respondemos a Mercado Pago para confirmar la recepción.
    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error: any) {
    console.error('Error al procesar la notificación de Mercado Pago:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
