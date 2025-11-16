import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email es requerido.' }, { status: 400 });
    }

    const { rows: users } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = users[0];

    // Importante: No revelar si el usuario existe o no.
    // Siempre devolvemos un mensaje de éxito genérico.
    if (!user) {
      console.log(`Solicitud de restablecimiento para email no existente: ${email}`);
      return NextResponse.json({ message: 'Si tu correo está en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.' });
    }

    // Generar token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Establecer fecha de expiración (ej. 1 hora)
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hora en milisegundos

    // Guardar el token hasheado y la fecha de expiración en la base de datos
    await db.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [hashedResetToken, tokenExpiry, user.id]
    );

    // Construir el enlace de restablecimiento
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    // --- SIMULACIÓN DE ENVÍO DE CORREO ---
    // En una aplicación real, aquí llamarías a tu servicio de email (SendGrid, Resend, etc.)
    // para enviar el `resetUrl` al `user.email`.
    console.log('----------------------------------------------------');
    console.log('--- SIMULACIÓN DE ENVÍO DE CORREO ---');
    console.log(`Enlace de restablecimiento para ${user.email}:`);
    console.log(resetUrl);
    console.log('----------------------------------------------------');
    // --- FIN DE LA SIMULACIÓN ---

    return NextResponse.json({ message: 'Si tu correo está en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.' });

  } catch (error) {
    console.error('Error en forgot-password:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
