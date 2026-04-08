export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-[--color-netflix-red] mb-4">
        Nabo Stream
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Next.js 16 + Tailwind v4 + Cloudflare амжилттай ажиллаж байна!
      </p>
      <button className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-all">
        Кино үзэх
      </button>
    </main>
  );
}