import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth((req) => {
  const cfReq = req as typeof req & { cloudflare?: { env: CloudflareEnv } };
  const cfEnv: CloudflareEnv | undefined =
    cfReq?.cloudflare?.env ??
    (globalThis as unknown as { __cloudflareEnv?: CloudflareEnv }).__cloudflareEnv;

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
    session: { strategy: db ? "database" : "jwt" },
    pages: {
      signIn: "/login",
      error:  "/login",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) token.id = user.id;
        return token;
      },
      async session({ session, token, user }) {
        if (token?.id) session.user.id = token.id as string;
        if (user?.id)  session.user.id = user.id;
        return session;
      },
    },
  };
});
