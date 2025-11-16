import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import PostgresAdapter from '@auth/pg-adapter';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Creamos un pool de conexiones para el adaptador de NextAuth
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Attempting to authorize user:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials.');
          return null;
        }

        // Buscar usuario en la base de datos
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
        const user = rows[0];

        if (!user || !user.password) {
          console.log('User not found in database or user has no password.');
          return null;
        }
        console.log('User found in database:', user.email);

        // Comprobar si la contraseña coincide
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          console.log('Password validation failed.');
          return null;
        }

        console.log('Password validation successful. Authorizing user.');
        // Devolver el objeto de usuario si todo es correcto
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Al iniciar sesión, añadimos el id y el rol del usuario al token
      if (user) {
        token.id = user.id;
        if (typeof user.role === 'string') {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Añadimos el id y el rol a la sesión para poder acceder a ellos en el cliente
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Le decimos a NextAuth que nuestra página de login está en /login
  },
  secret: process.env.NEXTAUTH_SECRET,
};
