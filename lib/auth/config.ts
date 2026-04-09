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
 *
 * FIX: strategy-г adapter-тай уялдуулав.
 * Өмнө нь strategy:"jwt" + DrizzleAdapter хамт байсан нь
 * sessions DB-д хадгалагддаггүй байлаа (зөвхөн JWT cookie).
 * Одоо adapter байвал "database", байхгүй бол "jwt" автоматаар сонгоно.
 */
export const { handlers, auth, signIn, signOut } = NextAuth((req) => {
  // Edge runtime дотор env-ийн DB binding авах
  // @ts-expect-error – Cloudflare edge context
  const cfEnv: CloudflareEnv | undefined =
    req?.cloudflare?.env ??
    (globalThis as unknown as { __cloudflareEnv?: CloudflareEnv }).__cloudflareEnv;

  // Cloudflare context байвал DB adapter идэвхжинэ
  const db = cfEnv ? getDb(cfEnv) : undefined;

  return {
    adapter: db ? DrizzleAdapter(db) : undefined,

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

    // ЧУХАЛ: adapter байвал "database" (sessions DB-д хадгалагдана),
    // байхгүй бол "jwt" (local dev болон edge-без-DB орчинд)
    session: { strategy: db ? "database" : "jwt" },

    pages: {
      signIn:  "/login",
      error:   "/login",
    },

    callbacks: {
      async jwt({ token, user }) {
        // "database" strategy-д энэ callback дуудагдахгүй
        if (user) token.id = user.id;
        return token;
      },
      async session({ session, token, user }) {
        // "database" strategy-д `user` байна, "jwt"-д `token` байна
        if (token?.id) session.user.id = token.id as string;
        if (user?.id)  session.user.id = user.id;
        return session;
      },
    },
  };
});
