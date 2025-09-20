import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const runtime = "edge";

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET || "",
  callbacks: {
    async jwt({ token, account, profile }) {
      // Attach provider access token if available
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose access token to the client session if present
      if (token?.accessToken) {
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
