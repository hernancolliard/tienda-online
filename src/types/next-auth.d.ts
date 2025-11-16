import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Se extiende la interfaz Session para que incluya la propiedad 'role'.
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  /**
   * Se extiende la interfaz User para que incluya la propiedad opcional 'role'.
   */
  interface User {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Se extiende la interfaz JWT para que incluya las propiedades 'id' y 'role'.
   */
  interface JWT {
    id: string;
    role: string;
  }
}
