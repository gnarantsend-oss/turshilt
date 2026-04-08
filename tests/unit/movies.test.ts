import { describe, it, expect } from "vitest";

// Кино шүүлтийн логикийг шалгана
type Movie = {
  id: number;
  title: string;
  tags: string[];
  genre: { id: number; name: string }[];
  rating: number;
};

const byTag    = (movies: Movie[], tag: string)  => movies.filter((m) => m.tags.includes(tag));
const byGenre  = (movies: Movie[], name: string) => movies.filter((m) => m.genre.some((g) => g.name === name));
const topRated = (movies: Movie[], n = 10)       => [...movies].sort((a, b) => b.rating - a.rating).slice(0, n);

const sampleMovies: Movie[] = [
  { id: 1, title: "Аврагч",    tags: ["trending", "top10"], genre: [{ id: 1, name: "Экшн" }],   rating: 4.8 },
  { id: 2, title: "Сүүдэр",    tags: ["new"],               genre: [{ id: 2, name: "Аймшиг" }], rating: 3.9 },
  { id: 3, title: "Найрамдал", tags: ["trending", "popular"], genre: [{ id: 3, name: "Инээдмийн" }], rating: 4.2 },
  { id: 4, title: "Мөс",       tags: ["popular"],            genre: [{ id: 2, name: "Аймшиг" }], rating: 4.5 },
];

describe("Кино шүүлт", () => {
  it("trending тагаар шүүнэ", () => {
    const result = byTag(sampleMovies, "trending");
    expect(result).toHaveLength(2);
    expect(result.map((m) => m.id)).toEqual([1, 3]);
  });

  it("genre-ээр шүүнэ", () => {
    const horror = byGenre(sampleMovies, "Аймшиг");
    expect(horror).toHaveLength(2);
  });

  it("үнэлгээгээр эрэмбэлнэ", () => {
    const top = topRated(sampleMovies, 2);
    expect(top[0].rating).toBe(4.8);
    expect(top[1].rating).toBe(4.5);
  });

  it("олдохгүй тагт хоосон массив буцаана", () => {
    expect(byTag(sampleMovies, "байхгүй_таг")).toHaveLength(0);
  });
});
