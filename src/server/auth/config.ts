import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Facebook from "next-auth/providers/facebook";
import Microsoft from "next-auth/providers/microsoft-entra-id";
import { db } from "@/server/db";
import { Role } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;  // Add role to session's user
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authConfig = {
  providers: [
    Google({}),
    Facebook({}),
    Resend({
      from: process.env.RESEND_FROM_EMAIL,
    }),
    Microsoft({}),
  ],
  adapter: PrismaAdapter(db),
  pages: {
    verifyRequest: "/auth/verify"
  },
  callbacks: {
    session: async ({ session, user }) => {
      const userWithRole = await db.user.findUnique({
        where: { id: user.id },
        select: { role: true, email: true }, 
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: userWithRole?.role ?? Role.USER,
          email: userWithRole?.email ?? session.user.email
        },
      };
    },
        signIn: async ({ user, account }) => {
      if (account && account.provider === 'google') {
        const existingUser = await db.user.findUnique({
          where: { id: user.id },
          select: { email: true },
        });

        if (existingUser && !existingUser.email) {
          await db.user.update({
            where: { id: user.id },
            data: {
              email: user.email, 
            },
          });
        }
      }
      return true; 
    },
  },
} satisfies NextAuthConfig;
