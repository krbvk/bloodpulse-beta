import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import { verifyOTP } from "@/lib/otp";

/**
 * Extend session with id + role
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    Google({}),
    Credentials({
      id: "otp-login",
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        console.log("👉 authorize() called with:", credentials);

        if (!credentials?.email || !credentials?.code) {
          console.log("❌ Missing credentials");
          return null;
        }

        const isValid = verifyOTP(credentials.email as string, credentials.code as string);
        console.log("🔑 OTP validation result:", isValid);

        if (!isValid) {
          console.log("❌ Invalid OTP for", credentials.email);
          return null;
        }

        let user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        console.log("🔎 Found user in DB:", user);

        if (!user) {
          user = await db.user.create({
            data: { email: credentials.email as string, role: Role.USER },
          });
          console.log("🆕 Created new user:", user);
        }

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    verifyRequest: "/auth/verify",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🟡 jwt() callback - before:", token, "user:", user);

      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? Role.USER;
        console.log("✅ jwt() storing user into token:", token);
      }

      return token;
    },
    async session({ session, token }) {
      console.log("🟢 session() callback - before:", session, "token:", token);

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as Role,
        },
      };
    },
    async signIn({ user, account }) {
      console.log("🔵 signIn() callback - user:", user, "account:", account);

      if (account && account.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { id: user.id },
          select: { email: true },
        });

        if (existingUser && !existingUser.email) {
          await db.user.update({
            where: { id: user.id },
            data: { email: user.email },
          });
          console.log("✏️ Updated Google user email:", user.email);
        }
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
