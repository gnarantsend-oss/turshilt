"use client";

/**
 * Philips Ambilight маягийн арын гэрэлтүүлэг.
 * Киноны постерын үндсэн өнгийг авч сайтын фон руу уусгана.
 */
export function AmbientGlowLayer({ color }: { color: string | null }) {
  const active = color !== null;

  return (
    <div
      className="ambient-dynamic-layer"
      style={{
        // CSS custom property-ээр өнгийг дамжуулна
        // Ингэснээр transition зөрчилгүй ажиллана
        ["--ambient-color" as string]: color
          ? `rgba(${color}, 0.45)`
          : "rgba(0,0,0,0)",
        opacity: active ? 1 : 0,
      }}
      aria-hidden
    />
  );
}
