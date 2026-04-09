import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

/**
 * Cloudflare Worker / Edge Runtime дотор D1-ээс Drizzle instance авах.
 *
 * Хэрэглэх жишээ (Route Handler):
 *   import { getDb } from "@/lib/db";
 *   export async function GET(req: Request, { cf }: { cf: { env: CloudflareEnv } }) {
 *     const db = getDb(cf.env);
 *     const movies = await db.select().from(schema.watchlist).all();
 *   }
 */
export function getDb(env: CloudflareEnv) {
  return drizzle(env.DB, { schema });
}

export { schema };
