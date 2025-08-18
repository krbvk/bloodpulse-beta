import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
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
    Resend({
      from: process.env.RESEND_FROM_EMAIL,
      async sendVerificationRequest({ identifier, url, provider }) {
        // use Resend API directly
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: "Sign in to BloodPulse",
            html: `
              <p>Sign in to <strong>BloodPulse</strong></p>
              <p>Click the link below to sign in:</p>
              <p><a href="${url}">${url}</a></p>
              <br />
              <p style="font-size:14px;color:#666">
                ⚠ <strong>For mobile users who installed the BloodPulse app:</strong> 
                Please open this link directly in the app for the best experience.
              </p>
            `,
            text: `Sign in to BloodPulse
            ${url}

            ⚠ For mobile users who installed the BloodPulse app:
            Please open this link directly in the app for the best experience.`
          }),
        });

        if (!res.ok) {
          throw new Error("Resend email send failed");
        }
      },
    }),
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
