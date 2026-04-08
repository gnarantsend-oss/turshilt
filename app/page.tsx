import { Play, Info } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-netflix-black">
      {/* Navbar (Sticky) */}
      <nav className="fixed top-0 w-full p-5 z-50 bg-gradient-to-b from-black/80 to-transparent transition-colors duration-500 hover:bg-black">
        <div className="flex items-center gap-8">
          <h1 className="text-netflix-red text-3xl font-bold tracking-wider">NABO</h1>
          <div className="hidden md:flex gap-4 text-sm font-medium text-gray-300">
            <a href="#" className="text-white">Home</a>
            <a href="#" className="hover:text-white transition">TV Shows</a>
            <a href="#" className="hover:text-white transition">Movies</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" 
          alt="Hero Background" 
          fill
          priority
          className="absolute inset-0 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        
        <div className="absolute bottom-[20%] left-10 md:left-20 max-w-2xl z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">DUNE: PART TWO</h2>
          <p className="text-lg text-gray-200 mb-6 drop-shadow-md line-clamp-3">
            Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
          </p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded md:text-xl font-bold hover:bg-white/80 transition">
              <Play fill="black" size={24} /> Play
            </button>
            <button className="flex items-center gap-2 bg-gray-500/70 text-white px-6 py-2 rounded md:text-xl font-bold hover:bg-gray-500/50 transition">
              <Info size={24} /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Movie Row */}
      <div className="px-10 md:px-20 pb-20 -mt-10 relative z-20">
        <h3 className="text-2xl font-semibold mb-4">Trending Now</h3>
        <div className="flex gap-4 overflow-x-auto pb-5 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="relative min-w-[200px] md:min-w-[250px] h-[140px] bg-netflix-dark rounded-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-30">
              <Image 
                src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop&sig=${item}`} 
                alt={`Movie Thumbnail ${item}`} 
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}