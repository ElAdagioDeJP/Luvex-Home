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
