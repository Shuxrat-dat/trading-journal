import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: {
          label: "Логин",
          type: "text",
        },
        password: {
          label: "Пароль",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.username,
            password: credentials.password,
          },
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
};