import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { db } from "@/lib/db"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          let existingUser = await db.user.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            existingUser = await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                googleId: account.providerAccountId,
                role: 'CUSTOMER'
              }
            });
          } else if (!existingUser.googleId) {
            existingUser = await db.user.update({
              where: { email: user.email! },
              data: {
                googleId: account.providerAccountId,
                image: user.image
              }
            });
          }

          token.id = existingUser.id;
          token.role = existingUser.role;
          token.googleId = existingUser.googleId || undefined;
        } catch (error) {
          console.error('Error during sign in:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.googleId = token.googleId;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          return true;
        } catch (error) {
          console.error('Error during sign in validation:', error);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };