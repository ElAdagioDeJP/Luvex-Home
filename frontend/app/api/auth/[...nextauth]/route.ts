import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const runtime = "edge";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn(message) {
      // Cuando un usuario inicia con Google, intenta enviar el id_token al backend
      try {
        const { account } = message
        if (!account) return
        // account.id_token puede no estar disponible dependiendo de provider config
        const idToken = (account as any).id_token || (account as any).idToken || null
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        if (idToken) {
          await fetch(`${backendUrl}/auth/google/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: idToken }),
          })
        }
      } catch (e) {
        // Silenciar errores para no romper el flujo de NextAuth
        console.error('Error forwarding id_token to backend', e)
      }
    }
  },
  callbacks: {
    async session({ session, token, user }) {
      // Puedes añadir datos adicionales al session object aquí
      return session;
    },
    async jwt({ token, account, profile }) {
      // Guardar provider account info si la necesitas
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
