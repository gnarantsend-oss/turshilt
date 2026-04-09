export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster: string;
  banner: string;
  rating: number;
  bunnyEmbedUrl: string;
  genre: { id: number; name: string }[];
  tags: string[];
};
