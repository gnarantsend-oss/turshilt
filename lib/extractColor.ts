/**
 * Зурагны хамгийн тод, хамгийн өнгөлөг өнгийг canvas ашиглан гаргаж авна.
 * Гадаад санг шаарддаггүй — зөвхөн browser Canvas API.
 *
 * FIX: Cache-ийн хэмжээг хязгаарлав (LRU-style).
 * Өмнө нь module-level Map хязгааргүй өсдөг байсан нь олон зурагтай
 * streaming platform дээр memory leak үүсгэдэг байлаа.
 */

const CACHE_MAX = 100; // Хамгийн ихдээ 100 зургийн өнгө санах
const cache = new Map<string, string>();

function setCache(key: string, value: string) {
  // Cache дүүрвэл хамгийн эртнийхийг устгана (Map insertion order)
  if (cache.size >= CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, value);
}

export async function extractDominantColor(src: string): Promise<string | null> {
  if (cache.has(src)) return cache.get(src)!;

  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        // Жижиг хэмжээнд resize хийж pixel sampling хурдасгана
        const SIZE = 80;
        canvas.width  = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

        let bestColor = "120,120,120";
        let bestScore = -1;

        // 4 пиксел тутамд нэгийг авч шалгана (r,g,b,a)
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue; // тунгалаг пиксел алгасна

          // Хэт бараан эсвэл хэт цайлган өнгийг хасна
          const brightness = (r + g + b) / 3;
          if (brightness < 30 || brightness > 225) continue;

          // Saturation: хамгийн их болон хамгийн бага каналын зөрүү
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;

          // Vibrance score: saturation + brightness дундаж руу ойртох
          const midBonus = 1 - Math.abs(brightness - 128) / 128;
          const score = saturation * 0.7 + midBonus * 0.3;

          if (score > bestScore) {
            bestScore = score;
            bestColor = `${r},${g},${b}`;
          }
        }

        const result = bestScore > 0.1 ? bestColor : null;
        if (result) setCache(src, result); // cache.set-ийн оронд setCache ашиглана
        resolve(result);
      } catch {
        // CORS-аас болж canvas tainted болвол gracefully орхино
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = src;
  });
}
