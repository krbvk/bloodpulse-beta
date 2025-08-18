import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Email from "next-auth/providers/email"
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
        const loginUrl = new URL(url);

      const html = `
        <body style="background: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="20" cellpadding="0" 
                style="background: white; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #eaeaea;">
            <tr>
              <td align="center" style="padding: 30px;">
                <h1 style="color: #333; font-size: 22px; margin-bottom: 20px;">
                  Sign in to <strong>BloodPulse</strong>
                </h1>

                <p style="font-size: 16px; margin: 20px 0; color: #444;">
                  Click the button below to sign in:
                </p>

                <a href="${url}" 
                  style="display:inline-block; padding: 12px 24px; 
                          background:#E63946; color:white; text-decoration:none; 
                          border-radius:6px; font-weight:600; font-size:16px;">
                  🔗 Sign in to BloodPulse
                </a>

                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  ⚠ <strong>For mobile users who installed the BloodPulse app:</strong><br>
                  <strong>Please open this link directly in the app for the best experience.</strong>
                </p>
              </td>
            </tr>
          </table>
        </body>
      `;

        const text = `
    Sign in to bloodpulse.tech

    Click the link below to sign in:
    ${url}

    ⚠ For mobile users who installed the BloodPulse app:
    Please open this link directly in the app for the best experience.
        `;

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: "Sign in to bloodpulse.tech",
            html,
            text,
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
