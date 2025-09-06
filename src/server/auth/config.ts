import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import { verifyOTP } from "@/lib/otp";
import type { User as NextAuthUser, Account } from "next-auth";

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

  interface User {
    id: string;
    role: Role;
  }

  interface JWT {
    id: string;
    role: Role;
  }

  interface GoogleUserProfile {
    name?: string;
    picture?: string;
    email?: string;
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

        const isValid = await verifyOTP(credentials.email as string, credentials.code as string);
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

        return { id: user.id, email: user.email, role: user.role, name: user.name ?? null, image: user.image ?? null };
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
        const typedUser = user as User;
        token.id = typedUser.id;
        token.role = typedUser.role ?? Role.USER;
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
  async signIn({ user, account, profile }) {
    console.log("🔵 signIn() callback - user:", user, "account:", account);

  if (account?.provider === "google" && user?.email) {
    const googleProfile = profile as GoogleUserProfile | null;
    // provider profile usually contains name and picture
    const googleName = googleProfile?.name ?? user.name ?? null;
    const googleImage = googleProfile?.picture ?? user.image ?? null;

    try {
      // Upsert by email: update name/image if present, or create with them.
      await db.user.upsert({
        where: { email: user.email },
        update: {
          // only set fields if provider gave them; otherwise leave existing values
          ...(googleName ? { name: googleName } : {}),
          ...(googleImage ? { image: googleImage } : {}),
        },
        create: {
          email: user.email,
          name: googleName ?? undefined,
          image: googleImage ?? undefined,
          role: Role.USER,
        },
      });

      // Link the OAuth account to the user (if not already linked)
      await db.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        update: {
          userId: (await db.user.findUnique({ where: { email: user.email } }))!.id,
        },
        create: {
          userId: (await db.user.findUnique({ where: { email: user.email } }))!.id,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          access_token: account.access_token,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
        },
      });

      console.log("✅ Upserted user and linked account for", user.email);
    } catch (err) {
      console.error("❌ Error upserting user from Google profile:", err);
      // allow sign in but log the error; or return false to reject sign in
    }
  }
    return true;
  }
  },
} satisfies NextAuthConfig;
