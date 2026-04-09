export async function GET() {
  return new Response(JSON.stringify({ error: "Auth disabled" }), { status: 404 });
}
export async function POST() {
  return new Response(JSON.stringify({ error: "Auth disabled" }), { status: 404 });
}
export const runtime = "edge";
