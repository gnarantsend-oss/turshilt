import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/lib/db";

/**
 * Auth.js v5 тохиргоо
 *
 * Орчны хувьсагч (.env.local):
 *   AUTH_SECRET=<openssl rand -base64 32 гэж үүсгэнэ>
 *   AUTH_GOOGLE_ID=...
 *   AUTH_GOOGLE_SECRET=...
 *   AUTH_GITHUB_ID=...
 *   AUTH_GITHUB_SECRET=...
 */
export const { handlers, auth, signIn, signOut } = NextAuth((req) => {
  // Edge runtime дотор env-ийн DB binding авах
  // @ts-expect-error – Cloudflare edge context
  const env: CloudflareEnv = req?.cloudflare?.env ?? (globalThis as any).__cloudflareEnv;

  return {
    adapter: env ? DrizzleAdapter(getDb(env)) : undefined,

    providers: [
      Google({
        clientId:     process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      }),
      GitHub({
        clientId:     process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
      }),
    ],

    session: { strategy: "jwt" },

    pages: {
      signIn:  "/login",
      error:   "/login",
    },

    callbacks: {
      async jwt({ token, user }) {
        if (user) token.id = user.id;
        return token;
      },
      async session({ session, token }) {
        if (token.id) session.user.id = token.id as string;
        return session;
      },
    },
  };
});
