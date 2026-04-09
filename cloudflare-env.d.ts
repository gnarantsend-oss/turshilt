// Автоматаар үүсгэх: npx wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts
// wrangler.jsonc-ийн binding-уудтай тохирч байна

interface CloudflareEnv {
  // D1 өгөгдлийн сан (wrangler.jsonc → d1_databases[].binding)
  DB: D1Database;

  // Static assets (wrangler.jsonc → assets.binding)
  ASSETS: Fetcher;

  // Image optimization (wrangler.jsonc → images.binding)
  IMAGES: Fetcher;

  // Self-reference service binding (wrangler.jsonc → services[].binding)
  WORKER_SELF_REFERENCE: Fetcher;
}
