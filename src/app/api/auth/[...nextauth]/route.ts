import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              image: true
            }
          });

          if (!user || !user.password) {
            return null;
          }

          const isValidPassword = await compare(credentials.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error('Error in credentials authorization:', error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          let existingUser = await db.user.findUnique({
            where: { email: user.email! }
          });

          // Handle Google sign in
          if (account.provider === 'google') {
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
          }

          // Handle credentials sign in - user already exists from authorize function
          if (account.provider === 'credentials' && existingUser) {
            // existingUser is already found above
          }

          // Ensure we have a user at this point
          if (existingUser) {
            token.id = existingUser.id;
            token.role = existingUser.role;
            token.googleId = existingUser.googleId || undefined;
          }
        } catch (error) {
          console.error('Error during sign in:', error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.googleId = token.googleId as string;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          return true;
        } catch (error) {
          console.error('Error during Google sign in validation:', error);
          return false;
        }
      }
      
      if (account?.provider === 'credentials') {
        return true;
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